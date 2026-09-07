# BNS Innovation Website

Static one-page website for BNS Innovation LLC.

## Files
- `index.html`
- `styles.css`

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

Replace the temporary `mailto:info@bnsinnovation.com` link if that mailbox does not exist yet.

The site currently links to:
https://github.com/TarekAref
