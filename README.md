# BNS Innovation Website

Static website for BNS Innovation LLC, with a dedicated construction and engineering PMO page.

## Review the PMO changes locally

These changes are prepared for review on `feature/pmo-services-preview`. They have not been published to the production branch.

1. Download this branch as a ZIP and extract it, or use the local checkout.
2. Open a terminal in the folder containing `index.html`.
3. On Windows with Python installed, run:

   ```powershell
   py -m http.server 8000 --bind 127.0.0.1
   ```

   On macOS/Linux, use `python3` instead of `py`.
4. Open `http://localhost:8000/pmo/` for the PMO page, or `http://localhost:8000/` for the updated homepage.
5. Stop the server with Ctrl+C when finished.

For a quick file preview without Python, open `pmo/index.html` in your browser. HTTP preview is preferred for verifying directory URLs, refresh behavior, and navigation.

### Review checklist

- Open `/pmo/` directly and refresh it.
- Check the desktop layout and mobile widths around 390px and 768px.
- Open the mobile menu, follow a link, and use Escape to close it.
- Click each package button and verify the inquiry form selects the corresponding option.
- Try `http://localhost:8000/pmo/?package=expanded#inquiry`.
- Choose Phone and confirm that the phone number becomes required.
- Use dummy data to check validation and the preview-only submission message. Do not use real customer data.
- Open `/pmo/thank-you.html` to review the confirmation page; viewing it does not send or validate an inquiry.

Local, file, and other non-production previews block form submission when JavaScript is enabled. Keep JavaScript enabled while reviewing. The native no-JavaScript form fallback points to the live form service, so do not submit it during preview.

## Files

- `index.html`: existing homepage and updated PMO overview/navigation.
- `styles.css`: shared BNS design and form feedback styles.
- `assets/site.js`: shared navigation, form validation feedback, and preview submission guard.
- `pmo/index.html`: packages, leadership experience, FAQs, and inquiry form.
- `pmo/pmo.css`: scoped responsive PMO styles.
- `pmo/pmo.js`: package selection and conditional phone requirement.
- `pmo/thank-you.html`: PMO-specific submission confirmation.
- `thank-you.html`: existing general inquiry confirmation, unchanged.
- `tests/pmo.test.cjs`: interaction checks using mocked DOM events, without browser/network access.

## Forms

Both forms retain `https://formsubmit.co/info@bnsinnovation.com`, the existing recipient, honeypot, and enabled verification (`_captcha=true`). The PMO form returns to `/pmo/thank-you.html` after the hosted submission flow. There is no new backend, booking system, subscription, or browser storage of inquiry data.

Client-side required-field and offline errors have visible feedback. Server-side errors and verification are handled by FormSubmit on its hosted page. No successful inbox delivery has been claimed or tested in this update. The form service may require confirmation of a newly used form before delivery; a live test is reserved for explicit authorization.

## Verification performed

Run the interaction checks with Node.js:

```sh
node --test tests/pmo.test.cjs
```

Eleven checks cover package links, URL selection, phone requirements, preview/offline submission blocking, production native-submit behavior, mobile-menu events, and form destination/verification settings. Additional static checks verified internal links/assets/anchors, unique IDs, label associations, prices, and the unchanged unrelated homepage sections.

Visual browser QA was unavailable in the implementation environment. Responsive CSS was reviewed, but rendered layout at desktop/mobile sizes still needs review in the preview. Real form submissions were deliberately not sent.

## Hosting observations

The repository contains plain HTML, CSS, and JavaScript with no framework build, project-specific agent instructions, or custom workflow files. `CNAME` is `bnsinnovation.com`. GitHub reports Pages enabled, and the latest observed GitHub Pages deployment used `main` at commit `f6d414684b37b802c8482155fe9dd0ada0950744`.

The new route is a physical `pmo/index.html`, with relative assets and homepage links. It does not depend on client-side routing or a 404 rewrite. Production Pages settings were not changed. The private Pages-settings endpoint was unavailable; deployment history and repository configuration were inspected instead.

## Publish with GitHub Pages

1. Create a new GitHub repository, for example: `bnsinnovation-site`
2. Upload `index.html` and `styles.css`
3. In GitHub, open **Settings > Pages**
4. Under **Build and deployment**, select **Deploy from a branch**
5. Choose branch `main` and folder `/ (root)`
6. Save
7. GitHub will publish the site on a temporary `github.io` address

## Connect bnsinnovation.com

In GitHub Pages settings:
1. Enter `bnsinnovation.com` under **Custom domain**
2. Save

In GoDaddy DNS, create:
- A record: Host `@` → `185.199.108.153`
- A record: Host `@` → `185.199.109.153`
- A record: Host `@` → `185.199.110.153`
- A record: Host `@` → `185.199.111.153`
- CNAME record: Host `www` → `YOUR-GITHUB-USERNAME.github.io`

After DNS propagates, enable **Enforce HTTPS** in GitHub Pages.

## Before Launch

Review the preview and confirm the final service scope and prices before merging to the production branch. Perform a live form-delivery check only when authorized.

The site currently links to:
https://github.com/TarekAref
