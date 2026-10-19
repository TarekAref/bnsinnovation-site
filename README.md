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

If Windows does not recognize `py` but Python is installed as `python`, use `python -m http.server 8000 --bind 127.0.0.1`. Use an HTTP preview to verify directory URLs, refresh behavior, navigation, and package buttons. Opening the file directly is only suitable for a visual read-through.

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
- `pmo/index.html`: packages with completion criteria, an illustrative (fictional) sample report, leadership experience, what the client provides, FAQs, and the shorter inquiry form with a privacy note.
- `pmo/pmo.css`: scoped responsive PMO styles.
- `pmo/pmo.js`: package selection and conditional phone requirement.
- `pmo/thank-you.html`: PMO-specific submission confirmation with next steps.
- `thank-you.html`: existing general inquiry confirmation, unchanged.
- `tests/pmo.test.cjs`: interaction checks using mocked DOM events, without browser/network access.

## Forms

Both forms retain `https://formsubmit.co/info@bnsinnovation.com`, the existing recipient, honeypot, and enabled verification (`_captcha=true`). The PMO form returns to `/pmo/thank-you.html` after the hosted submission flow. There is no new backend, booking system, subscription, or browser storage of inquiry data.

Client-side required-field and offline errors have visible feedback. Server-side errors and verification are handled by FormSubmit on its hosted page. No successful inbox delivery has been claimed or tested in this update. The owner authorized one live test inquiry and publication after the launch checks pass. That inquiry has not been sent. The form service may require inbox activation before delivery. Completing the hosted verification step and confirming receipt at the existing destination are still required.

## Verification performed

Run the interaction checks with Node.js:

```sh
node --test tests/pmo.test.cjs
```

Seventeen checks cover package links, URL selection, phone requirements, preview/offline submission blocking, production native-submit behavior, mobile-menu events, form destination/verification settings, the "Request" call-to-action wording, the short list of required fields, in-page anchors, the fictional-sample labels, the absence of terms the owner has not set, and the privacy note. Additional static checks verified internal links/assets/anchors, unique IDs, label associations, prices, and the unchanged unrelated homepage sections.

Verification on Oct 19, 2026: `node --test tests/pmo.test.cjs` passed all 17 tests, with zero failures, on the assembled uploaded revision. Static inspection also passed for all four HTML pages: 49 links/assets, fragment targets, unique IDs, and the labels of 22 visible form controls. The general thank-you page and unrelated homepage sections remain unchanged.

The supplied revision notes report earlier browser checks at 375px and 1280px, including package selection, conditional phone validation, and preview submission blocking. Those browser checks were not independently repeated in this environment: its supported browser connection is unavailable. Automated tests use a mocked DOM and do not prove rendered layout or email delivery. A physical-phone review and one real FormSubmit verification/delivery check remain outstanding. No real inquiry has been sent and production is unchanged.

## Hosting observations

The repository contains plain HTML, CSS, and JavaScript with no framework build, project-specific agent instructions, or custom workflow files. `CNAME` is `bnsinnovation.com`. GitHub reports Pages enabled, and the latest observed GitHub Pages deployment used `main` at commit `f6d414684b37b802c8482155fe9dd0ada0950744`.

The new route is a physical `pmo/index.html`, with relative assets and homepage links. It does not depend on client-side routing or a 404 rewrite. Production Pages settings were not changed. The private Pages-settings endpoint was unavailable; deployment history and repository configuration were inspected instead.

## Release to the existing GitHub Pages site

Use the existing `TarekAref/bnsinnovation-site` repository. Do not create another repository, change hosting, or replace the existing DNS configuration.

1. Review `feature/pmo-services-preview`, including the page on a physical phone.
2. Complete the authorized real form test and confirm the message arrives at `info@bnsinnovation.com`. Local and branch previews intentionally block sending; a controlled browser test must preserve FormSubmit's verification step. Do not disable CAPTCHA or mistake the thank-you page for proof of inbox delivery.
3. Once the launch checks pass, merge the reviewed preview branch into `main` without overwriting unrelated work.
4. Wait for the existing GitHub Pages deployment to succeed. Check `/pmo/` directly, refresh it, verify its assets/navigation, and open `/pmo/thank-you.html`.

Publication is authorized after these checks. This revision has not been published.
