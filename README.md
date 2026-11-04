# StealVid frontend

React/Vite app for public videos the visitor owns or is authorized to download. French by default, English toggle. Premium dark grid design inspired by the owner's Base44 version.

## Development
`npm ci`, `npm run dev`, `npm test`, `npm run build`.

## Configuration
- `VITE_API_URL`: backend URL. Defaults to https://stealvid-api.onrender.com.
- `VITE_STRIPE_SUPPORT_URL`: optional PUBLIC Stripe-hosted Payment Link (`https://buy.stripe.com/...` or `https://checkout.stripe.com/...`). Never put a secret key here. Leave blank to keep payments disabled. After configuring this build variable on Render, rebuild the frontend.
- `VITE_CONTACT_EMAIL`: optional public support email; default contact is the creator's public X profile.

The support UI describes voluntary tips for the service, not charitable donations, subscriptions or tax-deductible gifts. No payment form or secret Stripe credentials are embedded. No payment is collected until a valid hosted payment link is configured. Confirm business eligibility with Stripe; a downloader must not facilitate unauthorized distribution or copyright infringement. Optional tips do not override Stripe business restrictions.

## Pages and static hosting
`npm run build` creates dedicated entry HTML files for `/fonctionnement`, `/plateformes`, `/faq`, `/soutenir`, `/contact`, `/confidentialite`, `/conditions`, `/droits-auteur` and the three platform pages. The build also includes `404.html`. This allows direct navigation/reloads on Render without introducing a router dependency or changing hosting redirects. Publish `dist`.

## Supported hosts
TikTok, Instagram Reels and X/Twitter only. Facebook and YouTube links are rejected. Private or login-required content is not supported.

Downloads retain the existing compatible MP4 path. Resolutions shown are source-reported available formats; the downloaded MP4 may have a different resolution. No guaranteed 4K, watermark removal, AI enhancement or invented quality scores.

## Verification
Frontend tests cover the three allowed platforms, rejected Facebook/YouTube/unsafe URLs, hosted Stripe link validation and thumbnail URL protocols. Build verified. Browser QA covers desktop homepage, FAQ expansion, language toggle, support page, and 390px mobile menu/support navigation. Live download regression is checked after deployment. Tests and code are not a guarantee that third-party platforms remain available.
