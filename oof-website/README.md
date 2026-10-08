# Onyeka Omitade Foundation website

Static site with no build step and no dependencies. Open index.html to preview, or deploy the folder as it is.

## Deploying on Vercel
Project > Settings > Build and Deployment
- Root Directory: oof-website
- Framework Preset: Other (leave build command and output directory empty)

## Before going live
1. Payments: set PAYMENT_URL at the top of assets/js/main.js (Paystack or Flutterwave payment page).
2. Forms: set FORM_ENDPOINT in the same file (for example a Formspree URL).
3. Impact numbers: the metrics (500+, 200+, 40+, 100+) in index.html and about.html are placeholders. Replace them with verified totals.
4. Donation outcomes: confirm what each amount pays for (index.html, donate.html, main.js).
5. Placeholders: [Bank name] and [0000000000] in donate.html, [info@onyekaomitadefoundation.org] in contact.html.
6. Social links: point the footer icons to the foundation's real accounts.
