# Onyeka Omitade Foundation website (v2)

Static site with no build step and no dependencies. Open `index.html` to preview, or deploy the folder as it is.

## Deploying on Vercel
Project → Settings → Build and Deployment:
- Root Directory: `oof-website`
- Framework Preset: Other (leave build command and output directory empty)

## Pages
index · about · programmes · stories · donate · contact

## Before going live
1. **Payments:** set `PAYMENT_URL` at the top of `assets/js/main.js` (Paystack / Flutterwave payment page).
2. **Forms:** set `FORM_ENDPOINT` in the same file (for example a Formspree URL) so the support, volunteer, partner and newsletter forms reach your inbox.
3. **Impact numbers:** the `STATS` figures (500+, 200+, 40+, 100+) in index.html and about.html are samples. Replace them with verified totals.
4. **Donation outcomes:** confirm what ₦5k / ₦10k / ₦25k / ₦50k pay for (index.html, donate.html, main.js).
5. **Placeholders:** `[Bank name]`, `[0000000000]` (donate.html) and `[info@onyekaomitadefoundation.org]` (contact.html).
6. **Social links:** point the footer Facebook, Instagram and TikTok icons to the foundation's real accounts.

## Built in
- Responsive WebP images with JPG fallback (assets/img/*-800.webp, *-1600.webp)
- Scroll-driven reveals (CSS `animation-timeline`, falls back gracefully), smooth page transitions (View Transitions)
- Respects reduced-motion settings, keyboard accessible, skip link, light and dark mode
- SEO: meta descriptions, Open Graph tags, schema.org NGO data
