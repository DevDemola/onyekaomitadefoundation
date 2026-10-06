/* =====================================================================
   Onyeka Omitade Foundation — site interactions (no dependencies)
   ---------------------------------------------------------------------
   SETUP FOR YOUR DEVELOPER
   1. PAYMENT_URL   Paystack / Flutterwave payment page link. The chosen
                    amount, frequency and email are appended as query
                    parameters (?amount=&frequency=&email=).
   2. FORM_ENDPOINT A form backend (Formspree, Getform, your own API)
                    that receives support / volunteer / partner /
                    newsletter submissions as JSON. Empty = show the
                    thank-you state only.
   ===================================================================== */
const PAYMENT_URL = "";   // e.g. "https://paystack.com/pay/onyeka-foundation"
const FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const naira = n => "₦" + Number(n).toLocaleString("en-NG");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- nav: solid on scroll, hide on scroll down ---------- */
  const nav = $(".nav");
  const hasHero = document.body.classList.contains("has-hero");
  const actbar = $(".actbar");
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    if (nav) {
      nav.classList.toggle("solid", !hasHero || y > 40);
      const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
      if (goingDown && y > 700) nav.classList.add("hide");
      if (goingUp || y < 200) nav.classList.remove("hide");
    }
    if (actbar) actbar.classList.toggle("show", y > (hasHero ? innerHeight * 0.7 : 320));
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const menu = $("#menu"), burger = $(".burger");
  if (menu && burger) {
    const close = () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; menu.setAttribute("aria-hidden", "true"); burger.focus(); };
    burger.addEventListener("click", () => {
      menu.classList.add("open"); menu.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden";
      setTimeout(() => $(".menu-close", menu).focus(), 50);
    });
    $(".menu-close", menu).addEventListener("click", close);
    $$("a", menu).forEach(a => a.addEventListener("click", () => { document.body.style.overflow = ""; menu.classList.remove("open"); }));
    addEventListener("keydown", e => { if (e.key === "Escape" && menu.classList.contains("open")) close(); });
  }

  /* ---------- manifesto: words light up as you scroll ---------- */
  const man = $(".manifesto");
  if (man) {
    const words = $$(".w", man);
    if (reduce) words.forEach(w => w.classList.add("lit"));
    else {
      const upd = () => {
        const r = man.getBoundingClientRect();
        const p = clamp((innerHeight * 0.85 - r.top) / (r.height * 0.9), 0, 1);
        const n = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle("lit", i < n));
      };
      addEventListener("scroll", upd, { passive: true }); upd();
    }
  }

  /* ---------- sticky story: swap image per step ---------- */
  const story = $(".story");
  if (story && "IntersectionObserver" in window) {
    const imgs = $$(".story-media img", story), steps = $$(".step", story), cap = $(".story-media .cap b", story);
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      const i = steps.indexOf(en.target);
      steps.forEach((s, k) => s.classList.toggle("on", k === i));
      imgs.forEach((im, k) => im.classList.toggle("on", k === i));
      if (cap) cap.textContent = String(i + 1).padStart(2, "0") + " / " + String(steps.length).padStart(2, "0");
    }), { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(s => io.observe(s));
    steps[0] && steps[0].classList.add("on");
  }

  /* ---------- programme index: hover preview ---------- */
  const pv = $(".ppreview");
  if (pv) {
    const pimgs = $$("img", pv), txt = $(".pv-text", pv), items = $$(".pitem");
    const set = i => {
      items.forEach((it, k) => it.classList.toggle("on", k === i));
      pimgs.forEach((im, k) => im.classList.toggle("on", k === i));
      if (txt) txt.textContent = items[i].dataset.blurb || "";
    };
    items.forEach((it, i) => { it.addEventListener("mouseenter", () => set(i)); it.addEventListener("focus", () => set(i)); });
    set(0);
  }

  /* ---------- journey timeline progress ---------- */
  $$(".timeline").forEach(t => {
    if (reduce) return;
    const upd = () => { const r = t.getBoundingClientRect(); t.style.setProperty("--prog", clamp((innerHeight * 0.9 - r.top) / (innerHeight * 0.5), 0, 1).toFixed(3)); };
    addEventListener("scroll", upd, { passive: true }); upd();
  });

  /* ---------- carousel ---------- */
  $$(".carousel").forEach(c => {
    const rail = $(".rail", c), bar = $(".rail-progress i", c);
    const step = () => ($(".slide", rail)?.getBoundingClientRect().width || 400) + 16;
    $$("[data-dir]", c).forEach(b => b.addEventListener("click", () => rail.scrollBy({ left: step() * +b.dataset.dir, behavior: reduce ? "auto" : "smooth" })));
    const upd = () => {
      const max = rail.scrollWidth - rail.clientWidth, vis = rail.clientWidth / rail.scrollWidth;
      if (bar) { bar.style.width = (vis * 100) + "%"; bar.style.transform = `translateX(${max ? (rail.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0}%)`; }
    };
    rail.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
    // mouse drag
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; rail.classList.add("drag"); } rail.scrollLeft = sl - dx; });
    addEventListener("pointerup", () => { if (!down) return; down = false; rail.classList.remove("drag"); });
    rail.addEventListener("click", e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  });

  /* ---------- lightbox ---------- */
  const lb = $("#lb");
  if (lb) {
    const img = $("img", lb), count = $(".count", lb);
    let list = [], idx = 0;
    const show = i => {
      idx = (i + list.length) % list.length;
      const b = list[idx]; img.src = b.dataset.full; img.alt = b.querySelector("img")?.alt || "";
      count.textContent = `${idx + 1} / ${list.length}`;
    };
    $$("[data-full]").forEach(b => b.addEventListener("click", () => {
      list = $$("[data-full]", b.closest("[data-gallery]") || document);
      show(list.indexOf(b));
      if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
    }));
    $(".prev", lb).addEventListener("click", () => show(idx - 1));
    $(".next", lb).addEventListener("click", () => show(idx + 1));
    $(".x", lb).addEventListener("click", () => lb.close());
    lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", e => { if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
    let tx = 0;
    lb.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
    lb.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); });
  }

  /* ---------- counters (final values are already in the HTML) ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; io.unobserve(en.target);
      const el = en.target.firstChild, t = +en.target.dataset.count, s = performance.now();
      const tick = n => { const p = Math.min(1, (n - s) / 1600); el.nodeValue = Math.round(t * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: 0.5 });
    $$("[data-count]").forEach(el => io.observe(el));
  }

  /* ---------- form helpers ---------- */
  const validate = form => {
    let first = null;
    $$("[required]", form).forEach(el => {
      const f = el.closest(".f"); const bad = !el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value));
      if (f) f.classList.toggle("bad", bad);
      if (bad && !first) first = el;
    });
    if (first) first.focus();
    return !first;
  };
  $$(".f input,.f textarea").forEach(el => el.addEventListener("input", () => el.closest(".f")?.classList.remove("bad")));
  const send = async (form, kind) => {
    if (!FORM_ENDPOINT) return;
    const data = { form: kind, page: location.pathname };
    $$("input,select,textarea", form).forEach(el => { if ((el.type === "radio" || el.type === "checkbox") && !el.checked) return; data[el.name || el.id] = el.value; });
    try { await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) }); } catch (e) {}
  };

  /* ---------- donate widget ---------- */
  const d = $("#donate-form");
  if (d) {
    const btnLabel = $("#d-label"), sum = $("#d-sum"), other = $("#d-other");
    const outcomes = [
      [50000, "helps fund a professional assessment and a school-placement plan for one child"],
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
      const { freq, amt } = state();
      btnLabel.textContent = amt ? `Give ${naira(amt)}${freq === "monthly" ? " monthly" : ""}` : "Choose an amount";
      const o = outcomes.find(x => amt >= x[0]);
      sum.textContent = amt && o ? `${naira(amt)}${freq === "monthly" ? " every month" : ""} ${o[1]}.` : "Choose an amount to see what it does.";
    };
    const q = new URLSearchParams(location.search);
    if (q.get("freq") === "once") $("#f-once").checked = true;
    if (q.get("amt")) {
      const v = q.get("amt"), r = $(`[name=amt][value="${v.replace(/\D/g, "")}"]`, d);
      if (r) r.checked = true; else if (v === "other") setTimeout(() => other.focus(), 400);
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
      $("#d-thanks").textContent = `Thank you${first ? ", " + first : ""}.`;
      $("#d-thanks-sub").textContent = `${naira(amt)}${freq === "monthly" ? " every month" : ""} will go to work for children and families. Once the payment link is connected, this step opens the secure checkout.`;
      $("#d-step1").hidden = true; $("#d-step2").hidden = false;
    });
    $("#d-back").addEventListener("click", () => { $("#d-step1").hidden = false; $("#d-step2").hidden = true; });
    render();
  }

  /* ---------- simple forms ---------- */
  $$("form[data-form]").forEach(form => form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validate(form)) return;
    send(form, form.dataset.form);
    const a = $(".form-body", form), b = $(".success", form);
    if (a && b) { a.hidden = true; b.hidden = false; } else form.reset();
    const msg = $(".form-msg", form); if (msg) msg.hidden = false;
  }));

  /* ---------- contact intents ---------- */
  const intents = $$(".intent");
  if (intents.length) {
    const pick = id => intents.forEach(b => { const on = b.dataset.panel === id; b.setAttribute("aria-selected", on); $("#" + b.dataset.panel).hidden = !on; });
    intents.forEach(b => b.addEventListener("click", () => { pick(b.dataset.panel); history.replaceState(null, "", "#" + b.dataset.panel.replace("p-", "")); }));
    const h = location.hash.slice(1);
    if (["support", "volunteer", "partner"].includes(h)) { pick("p-" + h); setTimeout(() => $("#write")?.scrollIntoView(), 60); }
  }

  /* ---------- programmes TOC active state ---------- */
  const toc = $$(".toc a");
  if (toc.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) toc.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-30% 0px -60% 0px" });
    $$(".psec").forEach(s => io.observe(s));
  }

  /* ---------- copy ---------- */
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    const done = () => { const t = b.textContent; b.textContent = "Copied"; setTimeout(() => b.textContent = t, 1400); };
    navigator.clipboard?.writeText(b.dataset.copy).then(done, () => {});
  }));

  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
})();
