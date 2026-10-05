/* Onyeka Omitade Foundation — site script
   ------------------------------------------------------------------
   SETUP (for your developer):
   1. PAYMENT_URL: your Paystack / Flutterwave payment page link.
      The chosen amount and frequency are added as ?amount=&frequency=
   2. FORM_ENDPOINT: a form backend (e.g. Formspree, Getform, or your own
      server) that receives the support, volunteer, partner and newsletter
      forms as JSON. Leave empty to show the thank-you message only.
   ------------------------------------------------------------------ */
const PAYMENT_URL = "";   // e.g. "https://paystack.com/pay/onyeka-foundation"
const FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = n => "₦" + Number(n).toLocaleString("en-NG");

  /* mobile menu */
  const mb = $(".menu-btn"), mn = $(".mnav");
  if (mb && mn) mb.addEventListener("click", () => {
    const open = mn.hidden; mn.hidden = !open; mb.setAttribute("aria-expanded", String(open));
  });

  /* send a form to FORM_ENDPOINT if configured */
  async function send(form, kind) {
    if (!FORM_ENDPOINT) return;
    const data = { form: kind };
    $$("input,select,textarea", form).forEach(el => {
      if (el.type === "radio" && !el.checked) return;
      data[el.name || el.id] = el.value;
    });
    try {
      await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
    } catch (e) { /* network issue: thank-you still shows */ }
  }

  /* donate form */
  const f = $("#dform");
  if (f) {
    const btn = $("#dbtn"), imp = $("#impact"), custom = $("#custom");
    const lines = [
      [50000, "helps fund a professional assessment and a school-placement plan for a child"],
      [25000, "helps a child start school with classroom support"],
      [10000, "helps cover a child’s regular therapy support"],
      [0, "helps supply learning and therapy materials for a child"]
    ];
    const state = () => {
      const freq = $("[name=freq]:checked", f).value;
      let amt = parseInt((custom.value || "").replace(/\D/g, ""), 10);
      if (!amt) { const r = $("[name=amt]:checked", f); amt = r ? parseInt(r.value, 10) : 0; }
      return { freq, amt };
    };
    const render = () => {
      const { freq, amt } = state();
      btn.textContent = amt ? `Donate ${fmt(amt)}${freq === "monthly" ? " monthly" : ""}` : "Choose an amount";
      const line = lines.find(l => amt >= l[0])[1];
      imp.textContent = amt ? `${fmt(amt)}${freq === "monthly" ? " a month" : ""} ${line}.` : "Pick an amount to see what it does.";
    };
    // prefill from ?amt=10000&freq=once
    const q = new URLSearchParams(location.search);
    if (q.get("freq") === "once") $("#f-once").checked = true;
    const qa = q.get("amt");
    if (qa) {
      const r = $(`[name=amt][value="${qa.replace(/\D/g, "")}"]`, f);
      if (r) r.checked = true; else if (qa === "other") setTimeout(() => custom.focus(), 300);
      else { $$("[name=amt]", f).forEach(x => x.checked = false); custom.value = Number(qa).toLocaleString("en-NG"); }
    }
    f.addEventListener("change", e => { if (e.target.name === "amt") custom.value = ""; render(); });
    custom.addEventListener("input", () => {
      custom.value = custom.value.replace(/[^\d]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (custom.value) $$("[name=amt]", f).forEach(r => r.checked = false);
      render();
    });
    f.addEventListener("submit", e => {
      e.preventDefault();
      const { freq, amt } = state();
      if (!amt) { custom.focus(); return; }
      if (PAYMENT_URL) {
        const u = new URL(PAYMENT_URL);
        u.searchParams.set("amount", amt); u.searchParams.set("frequency", freq);
        if ($("#demail").value) u.searchParams.set("email", $("#demail").value);
        location.href = u.toString(); return;
      }
      const n = $("#dname").value.trim().split(" ")[0];
      $("#dthanks").textContent = `Thank you${n ? ", " + n : ""}! ${fmt(amt)}${freq === "monthly" ? " every month" : ""}`;
      $("#dfields").hidden = true; $("#ddone").hidden = false;
    });
    $("#dback").addEventListener("click", () => { $("#dfields").hidden = false; $("#ddone").hidden = true; });
    render();
  }

  /* simple forms: support / volunteer / partner / newsletter */
  $$("form[data-simple]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const req = $$("[required]", form).find(el => !el.value.trim());
      if (req) { req.focus(); return; }
      send(form, form.dataset.simple);
      const fields = $(".fields", form), done = $(".done", form);
      if (fields) fields.hidden = true;
      if (done) done.hidden = false;
    });
  });

  /* contact tabs */
  $$(".tabs").forEach(t => {
    const btns = $$("button", t);
    btns.forEach(b => b.addEventListener("click", () => {
      btns.forEach(x => { x.setAttribute("aria-selected", x === b); $("#" + x.getAttribute("aria-controls")).hidden = x !== b; });
    }));
    if (location.hash) { const b = btns.find(x => "#" + x.dataset.hash === location.hash); if (b) { b.click(); const sec = t.closest("section"); if (sec) setTimeout(() => sec.scrollIntoView(), 50); } }
  });

  /* copy buttons */
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    const txt = b.dataset.copy;
    const ok = () => { const o = b.textContent; b.textContent = "Copied"; setTimeout(() => b.textContent = o, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, () => {});
  }));

  /* count-up for impact numbers (final values are already in the HTML) */
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; io.unobserve(en.target);
      const el = en.target, t = +el.dataset.count, s = performance.now();
      (function step(n) { const p = Math.min(1, (n - s) / 1200); el.firstChild.nodeValue = Math.round(t * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(s);
    }), { threshold: .6 });
    $$("[data-count]").forEach(el => io.observe(el));
  }

  /* footer year */
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
})();
