# Deployment

This document covers deployment of the NOIA static build to Vercel or Netlify, plus domain, security
and launch checks. It assumes the project runs locally and that the owner controls the `noia.az`
domain.

The app is a **static single-page application**. There is no server, database or API to deploy.
Hosting therefore only needs to:

1. run `npm run build`;
2. serve the `dist/` folder;
3. rewrite unknown paths to `index.html` so React Router can handle `/en/shop` and product URLs.

The included `vercel.json` and `netlify.toml` already do the last part.

---

## 1. Pre-launch checklist

Do not skip this section. The repository intentionally ships as an honest demo.

### Content

- [ ] Replace the eight example products in `src/data/products.ts`, or delete the ones that are not
      for sale.
- [ ] Confirm prices, materials, care instructions and availability with the owner.
- [ ] Review the about-page story and any business claims.
- [ ] Replace SVG illustrations with real, compressed product photos and update image paths/alt text.
- [ ] Replace `public/og-image.png` with a real 1200×630 social preview.
- [ ] Review `public/favicon.svg`; it is a simple NOIA monogram, not a final brand mark.

### Contact and configuration

Open `src/config/site.ts`.

- [ ] Set `email`, `whatsappNumber` and `instagramHandle` to the real, owner-approved values.
- [ ] Check WhatsApp format: country code + number, digits only, no `+`, spaces or dashes.
- [ ] Set `url` to the final production URL, normally `https://noia.az`.
- [ ] If the domain differs from `noia.az`, update the static URLs in `index.html` and
      `public/robots.txt` as well.
- [ ] Set `showExampleNotice` to `false` **only after** the catalogue and contact details are real.
- [ ] Confirm no private personal data is exposed unless the owner wants it public.

### Technical

- [ ] `npm ci` succeeds from a clean checkout.
- [ ] `npm run format:check` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes and `dist/` contains `index.html`, `assets/`, `sitemap.xml` and the
      public images.
- [ ] `npm run preview` works, including direct visits to `/en/shop` and a product URL.
- [ ] Test the inquiry form with a real phone and a real mail app before announcing the site.
- [ ] Test language switching on every page, then refresh and share the URL.
- [ ] Run a Lighthouse audit on mobile and desktop.

### Legal and privacy

- [ ] Add an imprint/legal page if Azerbaijani law or the owner's situation requires one.
- [ ] Explain what happens to inquiry data. Today the site sends nothing; the visitor's message goes
      through WhatsApp or their own e-mail provider.
- [ ] Add a privacy policy before introducing analytics, cookies, embedded social feeds or payments.
- [ ] Obtain permission for every photo of people or customer work.

---

## 2. Build locally

```bash
npm ci
npm run build
npm run preview
```

`npm run build` first regenerates `public/sitemap.xml`, then type-checks and builds the app into
`dist/`.

`npm run preview` serves the production build at <http://localhost:4173>. This is the closest local
equivalent to production. Check:

- `/` in Azerbaijani;
- `/en/shop` and `/ru/kolleksiya`;
- a product URL in each language;
- a made-up URL, which should show the styled 404 page;
- the inquiry form and each visible contact link.

The preview server implements the SPA fallback. A plain file server that does not do so will return
404 when you refresh a nested route — that is a hosting configuration issue, not an app bug.

---

## 3. Deploy to Vercel

### Option A — dashboard

1. Push the project to GitHub.
2. Go to <https://vercel.com>, sign in and choose **Add New → Project**.
3. Import the repository.
4. Vercel detects Vite. Confirm:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm ci` (or leave the default)
   - **Node.js version:** 24.x
5. Click **Deploy**.
6. Open the generated `*.vercel.app` URL and test a nested route such as `/en/shop` directly.

`vercel.json` supplies the rewrite and security headers. No environment variables are required.

### Option B — CLI

```bash
npm install -g vercel
vercel
vercel --prod
```

The CLI asks the same questions as the dashboard.

### Custom domain on Vercel

1. Open the project → **Settings → Domains**.
2. Add `noia.az` and `www.noia.az`.
3. Vercel shows the DNS records to create at the domain registrar. Use those exact values; they can
   change. For a typical apex domain this is an `A` record, and `www` is a `CNAME`.
4. Wait for DNS propagation (often minutes, can take longer).
5. Choose `noia.az` as the primary domain and redirect `www` to it.
6. Vercel issues and renews the TLS certificate automatically. Confirm HTTPS works and that HTTP
   redirects to HTTPS.

### Important: platform rewrite vs. 404 status

Because every unknown path is rewritten to `index.html`, the host returns HTTP 200 for a URL that
the app renders as “not found”. The page sets `noindex, nofollow`, so search engines are told not to
index it, but the HTTP status is still 200. If correct 404 status codes matter for SEO, you need
prerendering or a server-capable host that can map known routes. This is a known SPA trade-off, not a
configuration mistake.

---

## 4. Deploy to Netlify

### Option A — dashboard

1. Push the project to GitHub.
2. Go to <https://app.netlify.com>, choose **Add new site → Import an existing project**.
3. Select the repository.
4. Confirm the settings, which `netlify.toml` also defines:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 24 (set `NODE_VERSION=24` in site environment variables if Netlify does not
     read `.nvmrc` in your account configuration)
5. Deploy and test a direct visit to `/en/shop`.

`netlify.toml` contains the SPA redirect and basic security headers. The redirect returns status
200, which is required for client-side routing.

### Option B — CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Custom domain on Netlify

1. Open **Domain management → Add a domain** and enter `noia.az`.
2. Either delegate the domain to Netlify DNS, or keep your registrar's DNS and create the records
   Netlify displays.
3. Add `www.noia.az`, choose the primary domain, and enable the redirect from the other one.
4. Wait for DNS and the automatic Let's Encrypt certificate. Force HTTPS.

As with Vercel, always copy the DNS target values shown in the current dashboard rather than trusting
an old tutorial.

---

## 5. Other static hosts

The requirements are the same everywhere:

| Setting        | Value                           |
| -------------- | ------------------------------- |
| Install        | `npm ci`                        |
| Build          | `npm run build`                 |
| Publish/output | `dist`                          |
| Node           | 24.x                            |
| SPA fallback   | all paths → `/index.html` (200) |
| HTTPS          | required                        |

Examples:

- **Cloudflare Pages:** build command `npm run build`, output `dist`; add a `_redirects` file with
  `/* /index.html 200` if the dashboard fallback is not configured.
- **GitHub Pages:** possible only with extra work because project pages are served from a subpath and
  need a router basename and a `404.html` fallback. A custom apex domain avoids the subpath issue.
  This repository does not include a GitHub Pages workflow.
- **Shared hosting / cPanel:** upload the contents of `dist/`, then configure an `.htaccess` rewrite
  to `index.html`. Confirm that the host supports HTTPS.

Do not upload the source folder or `node_modules`. Only `dist/` is needed.

---

## 6. Domain and DNS overview for `noia.az`

The domain is assumed but **not verified** by this repository. The owner must control the registrar
account.

1. Register or confirm `noia.az` at an accredited `.az` registrar.
2. Add the domain in the hosting dashboard first, so the platform can show the expected records.
3. At the registrar, create either:
   - the platform's nameservers (simplest if offered), or
   - an `A`/`ALIAS` record for the apex and a `CNAME` for `www`.
4. Do not create conflicting `A`, `AAAA` or `CNAME` records for the same name.
5. Wait for propagation and verify with `nslookup noia.az` or <https://dnschecker.org>.
6. Enable automatic HTTPS and the `www` → apex (or apex → `www`) redirect.
7. Update `siteConfig.url` if the final URL differs, then redeploy so canonical links, Open Graph and
   the sitemap use the real domain. Also update the static fallback URLs in `index.html` and
   `public/robots.txt`; those are served before React runs and are what some crawlers read.

E-mail is separate from website hosting. If the owner needs `hello@noia.az`, configure MX records
with an e-mail provider. The `mailto:` button only needs the address to exist; it does not send mail
from the website.

---

## 7. SEO after deployment

The app sets page-specific metadata on the client. `index.html` contains Azerbaijani defaults for the
initial HTML response. That is acceptable for a small portfolio, but it is not equivalent to
server-rendered HTML.

Immediately after launch:

1. Confirm `https://noia.az/robots.txt` and `https://noia.az/sitemap.xml` load.
2. Add the property to [Google Search Console](https://search.google.com/search-console) and
   [Bing Webmaster Tools](https://www.bing.com/webmasters), verify ownership, and submit the sitemap.
3. Use the “URL Inspection” tool on the home page and one product page per language.
4. Check social previews with the Facebook Sharing Debugger, LinkedIn Post Inspector or a generic
   Open Graph checker. Some crawlers do not execute JavaScript and will use the static defaults.
5. Confirm canonical and `hreflang` links in the rendered page source.
6. Check that the 404 page is not indexed.

If organic search matters to the business, add **prerendering or static generation**. Options, in
order of effort:

- Add a prerender build step that writes static HTML for every route in the sitemap.
- Rebuild the front end with an SSG-capable framework (for example Astro with React islands, or a
  React framework with static generation).
- Serve the SPA from a platform that can render routes at the edge.

Any of these changes should keep the same URL scheme and content. This repository deliberately does
not pretend that client-side metadata is a complete SEO solution.

---

## 8. Security and privacy

Included:

- No secrets, API keys or backend credentials.
- All user-provided text is sanitised and URL-encoded before it enters a `wa.me` or `mailto:` URL.
- External links use `rel="noopener noreferrer"` where they open a new tab.
- Basic security headers are configured in `vercel.json` and `netlify.toml`
  (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- The site makes no third-party requests at runtime: fonts and images are self-hosted.

Deliberately not included:

- Content Security Policy. A correct CSP needs testing against the actual build and any future
  third-party services. Add one with a report-only rollout if required.
- Cookie consent and analytics. Add them only with a privacy review.
- Payment processing. Product prices are informational; orders happen in conversation.

The inquiry message may contain personal data (name, phone/e-mail, deadline). It is composed in the
visitor's browser and handed to WhatsApp or their mail client. The website itself does not log or
store it. If that changes, update the privacy policy first.

---

## 9. Post-launch verification

Run through this list on the live domain:

- [ ] `https://noia.az` loads over HTTPS with a valid certificate.
- [ ] `http://noia.az` redirects to HTTPS.
- [ ] `www` and apex behave as configured, with no duplicate content.
- [ ] All three languages load and the switcher keeps the current page.
- [ ] Shop search, category filters and product option selection work.
- [ ] Direct refresh on `/en/shop`, `/ru/tovar/<slug>` and `/haqqimizda` works.
- [ ] The custom-order form validates, shows the prepared message, and opens real WhatsApp/e-mail.
- [ ] A test message arrives at the owner's account.
- [ ] Only intended contact channels are visible.
- [ ] The demo strip is gone (`showExampleNotice: false`).
- [ ] Social preview shows the correct image, title and description.
- [ ] `sitemap.xml` contains only production URLs on the real domain.
- [ ] Lighthouse mobile scores are acceptable; no unexpected console or network errors.
- [ ] Keyboard navigation and focus states work.

---

## 10. Rollback and maintenance

- **Vercel:** open **Deployments**, find the last known-good deployment and choose **Promote to
  Production**.
- **Netlify:** open **Deploys**, select a previous successful deploy and choose **Publish deploy**.
- Git remains the source of truth: revert the bad commit, push, and let the platform rebuild.

Routine maintenance:

- Update dependencies in a branch, then run all checks and test the form before merging.
- Check the certificate and domain expiry.
- Review contact links when WhatsApp/Instagram change their URL formats.
- Re-run `npm run sitemap` after adding products (the build does it automatically).
- Review prices and availability regularly; example data must not silently become “real”.

---

## 11. Troubleshooting

### Build fails on the host but works locally

Check the Node version (24.x), run `npm ci` rather than `npm install`, and make sure `package-lock.json`
is committed. Read the first error in the build log, not the last.

### Nested URLs return 404

The SPA rewrite is missing or overridden. Confirm `vercel.json` is at the repository root for Vercel,
or `netlify.toml` for Netlify. On another host, add an equivalent fallback to `index.html`.

### Assets load from the wrong path

The site expects to be served from the domain root (`/`). If you deploy under a subdirectory, set
Vite's `base` option and the router basename, and update image paths. A custom domain is simpler.

### Contact buttons do not appear

`src/config/site.ts` is still empty or the values are invalid. Check the browser console in a local
development build for `[NOIA]` warnings. Remember that the compiled site has no development warnings.

### The old site still appears

Hard-refresh, check the deployment actually promoted to production, and confirm DNS points to the new
host. `index.html` is usually served with short cache lifetime; hashed assets in `/assets/` are
cached for a year by the provided configs, which is safe because their names change on every build.

### WhatsApp opens without the message

Very long messages can be truncated by some clients or platforms. The form enforces a 1200-character
description limit to reduce this. The copy button is the fallback. Test on both iOS and Android.
