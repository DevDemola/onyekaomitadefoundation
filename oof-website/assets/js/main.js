/* ======================================================================
   Onyeka Omitade Foundation · site interactions (no dependencies)
   ----------------------------------------------------------------------
   SETUP FOR YOUR DEVELOPER
   PAYMENT_URL    Paystack or Flutterwave payment page link. The chosen
                  amount, frequency and email are added as query
                  parameters (?amount=&frequency=&email=).
   FORM_ENDPOINT  A form backend (Formspree, Getform or your own API)
                  that receives the support, volunteer, partner and
                  newsletter forms as JSON. Leave empty to only show the
                  thank-you state.
   ====================================================================== */
const PAYMENT_URL = "";   // e.g. "https://paystack.com/pay/onyeka-foundation"
const FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const naira = n => "₦" + Number(n).toLocaleString("en-NG");

  /* nav border + mobile action bar */
  const nav = $(".nav"), bar = $(".actbar");
  const onScroll = () => {
    nav && nav.classList.toggle("scrolled", scrollY > 8);
    bar && bar.classList.toggle("show", scrollY > 480);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* mobile menu sheet */
  const sheet = $("#sheet"), burger = $(".burger");
  if (sheet && burger) {
    const open = () => { sheet.classList.add("open"); sheet.setAttribute("aria-hidden", "false"); burger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; setTimeout(() => $(".sheet-close", sheet).focus(), 30); };
    const close = () => { sheet.classList.remove("open"); sheet.setAttribute("aria-hidden", "true"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
    burger.addEventListener("click", open);
    $(".sheet-close", sheet).addEventListener("click", () => { close(); burger.focus(); });
    sheet.addEventListener("click", e => { if (e.target === sheet) close(); });
    $$("a", sheet).forEach(a => a.addEventListener("click", close));
    addEventListener("keydown", e => { if (e.key === "Escape" && sheet.classList.contains("open")) { close(); burger.focus(); } });
  }

  /* founder story tabs (auto-advance until the visitor interacts) */
  $$("[data-ftabs]").forEach(root => {
    const tabs = $$(".ftab", root), imgs = $$(".fmedia img", root);
    let i = 0, timer = null;
    const show = k => {
      i = k;
      tabs.forEach((t, n) => t.setAttribute("aria-selected", n === k));
      imgs.forEach((im, n) => im.classList.toggle("on", n === k));
    };
    const stop = () => { clearInterval(timer); timer = null; };
    tabs.forEach((t, n) => t.addEventListener("click", () => { stop(); show(n); }));
    root.addEventListener("keydown", e => {
      if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
      e.preventDefault(); stop();
      const n = (i + (e.key === "ArrowDown" ? 1 : -1) + tabs.length) % tabs.length; show(n); tabs[n].focus();
    });
    if (!reduce && "IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting && !timer) timer = setInterval(() => show((i + 1) % tabs.length), 6000);
        if (!en.isIntersecting) stop();
      }, { threshold: .4 }).observe(root);
      root.addEventListener("pointerenter", stop);
    }
  });

  /* programmes filter */
  const filters = $$(".filters button");
  if (filters.length) {
    const items = $$(".prog");
    filters.forEach(b => b.addEventListener("click", () => {
      filters.forEach(x => x.setAttribute("aria-pressed", x === b));
      const cat = b.dataset.cat;
      items.forEach(it => it.hidden = cat !== "all" && !it.dataset.cat.split(" ").includes(cat));
    }));
  }

  /* lightbox */
  const lb = $("#lb");
  if (lb) {
    const img = $("img", lb), count = $(".count", lb);
    let list = [], idx = 0;
    const show = k => {
      idx = (k + list.length) % list.length;
      img.src = list[idx].dataset.full; img.alt = list[idx].querySelector("img")?.alt || "";
      count.textContent = `${idx + 1} / ${list.length}`;
    };
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-full]"); if (!b) return;
      const scope = b.closest("[data-gallery]") || document;
      const seen = new Set();
      list = $$("[data-full]", scope).filter(x => !x.closest("[aria-hidden='true']") && !seen.has(x.dataset.full) && seen.add(x.dataset.full));
      show(Math.max(0, list.findIndex(x => x.dataset.full === b.dataset.full)));
      lb.showModal ? lb.showModal() : lb.setAttribute("open", "");
    });
    $(".prev", lb).addEventListener("click", () => show(idx - 1));
    $(".next", lb).addEventListener("click", () => show(idx + 1));
    $(".x", lb).addEventListener("click", () => lb.close());
    lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", e => { if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
    let tx = 0;
    lb.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
    lb.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); });
  }

  /* count-up (final values are already in the HTML) */
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; io.unobserve(en.target);
      const node = en.target.firstChild, t = +en.target.dataset.count, s = performance.now();
      const tick = n => { const p = Math.min(1, (n - s) / 1400); node.nodeValue = Math.round(t * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: .6 });
    $$("[data-count]").forEach(el => io.observe(el));
  }

  /* form helpers */
  const validate = form => {
    let first = null;
    $$("[required]", form).forEach(el => {
      const bad = !el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value));
      el.closest(".f")?.classList.toggle("bad", bad);
      el.setAttribute("aria-invalid", bad);
      if (bad && !first) first = el;
    });
    first && first.focus();
    return !first;
  };
  $$(".f input,.f textarea").forEach(el => el.addEventListener("input", () => { el.closest(".f")?.classList.remove("bad"); el.removeAttribute("aria-invalid"); }));
  const send = async (form, kind) => {
    if (!FORM_ENDPOINT) return;
    const data = { form: kind, page: location.pathname };
    $$("input,select,textarea", form).forEach(el => { if (el.type === "radio" && !el.checked) return; data[el.name || el.id] = el.value; });
    try { await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) }); } catch (e) {}
  };

  /* donation widget */
  const d = $("#donate-form");
  if (d) {
    const label = $("#d-label"), sum = $("#d-sum"), other = $("#d-other");
    const outcomes = [
      [50000, "helps fund a professional assessment and a school placement plan for one child"],
      [25000, "helps one child start school with the classroom support they need"],
      [10000, "helps keep one child in regular therapy"],
      [1, "helps provide learning and therapy materials for a child"]
    ];
    const state = () => {
      const freq = $("[name=freq]:checked", d).value;
      let amt = parseInt(other.value.replace(/\D/g, ""), 10);
      if (!amt) { const r = $("[name=amt]:checked", d); amt = r ? +r.value : 0; }
      return { freq, amt };
    };
    const render = () => {
      const { freq, amt } = state(), o = outcomes.find(x => amt >= x[0]);
      label.textContent = amt ? `Give ${naira(amt)}${freq === "monthly" ? " / month" : ""}` : "Choose an amount";
      sum.textContent = amt && o ? `${naira(amt)}${freq === "monthly" ? " every month" : ""} ${o[1]}.` : "Choose an amount to see what it does.";
    };
    const q = new URLSearchParams(location.search);
    if (q.get("freq") === "once") $("#f-once").checked = true;
    if (q.get("amt")) {
      const v = q.get("amt"), r = $(`[name=amt][value="${v.replace(/\D/g, "")}"]`, d);
      if (r) r.checked = true;
      else if (v === "other") setTimeout(() => other.focus(), 300);
      else if (+v) { $$("[name=amt]", d).forEach(x => x.checked = false); other.value = (+v).toLocaleString("en-NG"); }
    }
    d.addEventListener("change", e => { if (e.target.name === "amt") other.value = ""; render(); });
    other.addEventListener("input", () => {
      other.value = other.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (other.value) $$("[name=amt]", d).forEach(r => r.checked = false);
      render();
    });
    d.addEventListener("submit", e => {
      e.preventDefault();
      const { freq, amt } = state();
      if (!amt) { other.focus(); return; }
      if (!validate(d)) return;
      if (PAYMENT_URL) {
        const u = new URL(PAYMENT_URL);
        u.searchParams.set("amount", amt); u.searchParams.set("frequency", freq); u.searchParams.set("email", $("#d-email").value);
        location.href = u.toString(); return;
      }
      const first = $("#d-name").value.trim().split(/\s+/)[0];
      $("#d-thanks").textContent = `Thank you${first ? ", " + first : ""}!`;
      $("#d-thanks-sub").textContent = `Your ${naira(amt)}${freq === "monthly" ? " monthly" : ""} gift is ready. Once the payment link is connected, this step opens the secure checkout.`;
      $("#d-step1").hidden = true; $("#d-step2").hidden = false;
    });
    $("#d-back").addEventListener("click", () => { $("#d-step1").hidden = false; $("#d-step2").hidden = true; });
    render();
  }

  /* simple forms */
  $$("form[data-form]").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validate(form)) return;
    send(form, form.dataset.form);
    const body = $(".form-body", form), ok = $(".success", form), msg = $(".form-msg", form);
    if (body && ok) { body.hidden = true; ok.hidden = false; } else form.reset();
    if (msg) msg.hidden = false;
  }));

  /* contact intents */
  const intents = $$(".intent");
  if (intents.length) {
    const pick = id => intents.forEach(b => { const on = b.dataset.panel === id; b.setAttribute("aria-selected", on); $("#" + b.dataset.panel).hidden = !on; });
    intents.forEach(b => b.addEventListener("click", () => { pick(b.dataset.panel); history.replaceState(null, "", "#" + b.dataset.panel.slice(2)); }));
    const h = location.hash.slice(1);
    if (["support", "volunteer", "partner"].includes(h)) { pick("p-" + h); setTimeout(() => $("#write")?.scrollIntoView(), 60); }
  }

  /* copy buttons */
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    const done = () => { const t = b.textContent; b.textContent = "Copied"; setTimeout(() => b.textContent = t, 1400); };
    navigator.clipboard?.writeText(b.dataset.copy).then(done, () => {});
  }));

  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
})();
