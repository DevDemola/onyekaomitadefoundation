# Onyeka Omitade Foundation website

Static website: open `index.html` in a browser to preview. Upload the whole folder to any web host (cPanel, Netlify, Vercel, GitHub Pages), or use it as the design for a WordPress build.

## Pages
- index.html: Home
- about.html: About (story, mission, vision, values, how we work)
- programmes.html: All 6 programmes
- stories.html: Delight's story, Play Without Label gallery, early signs of autism guide
- donate.html: Donation form, bank transfer, other ways to help
- contact.html: Contact details and Support / Volunteer / Partner forms

## Before going live
1. **Payments:** in `assets/js/main.js` set `PAYMENT_URL` to your Paystack or Flutterwave payment link.
2. **Forms:** in `assets/js/main.js` set `FORM_ENDPOINT` (e.g. a Formspree form URL) so form messages reach your inbox.
3. **Impact numbers:** replace the sample figures (500+, 200+, 40+, 100+) in index.html and about.html.
4. **Donation amounts:** confirm what ₦5,000 / ₦10,000 / ₦25,000 / ₦50,000 pay for (donate.html, index.html, main.js).
5. **Bank details and email:** replace `[Bank name]`, `[0000000000]` (donate.html) and `[info@onyekaomitadefoundation.org]` (contact.html).
6. **Social links:** point the Facebook, Instagram and TikTok icons in each page's footer to the foundation's own accounts.
