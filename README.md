# Wavelinks

Share a destination without revealing it. Generates a masked link like `/m/[token]` which opens the target URL in a full-screen iframe. No login, no database.

## How it works
- The server encrypts the target URL into a token using `AES-256-CBC` with a secret key.
- The shareable link is `/m/<token>`.
- The masked page decrypts the token server-side and renders the target in an iframe. The address bar never shows the original URL.

Note: Some websites disallow embedding via `X-Frame-Options` or CSP. Those cannot be displayed inside an iframe.

## Local development

```bash
npm install
npm run dev
```

Set an encryption secret in `.env.local` (optional but recommended):

```bash
MASK_SECRET="your-long-random-secret"
```

## Deployment on Vercel
1. Push this repo to GitHub/GitLab.
2. Import the project in Vercel.
3. Add environment variable `MASK_SECRET` in Project Settings → Environment Variables.
4. Deploy. Your app will be available at `https://your-app.vercel.app`.

## API
- `POST /api/mask` with `{ url: string }` → `{ token: string }`

## Security & Privacy
- No database is used. The URL is contained within the token.
- Use a strong `MASK_SECRET` in production. Rotating the secret invalidates existing links.
