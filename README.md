# Sam, Isaac & Ben's Coin Chart

**Live:** [https://mccolm-coin-chart.vercel.app](https://mccolm-coin-chart.vercel.app)

Kids rewards PWA — separate deploy from [The Ledger](https://github.com/richiemccolm-creator/the-ledger), same Supabase project when you wire persistence.

**Stack:** static HTML + React (CDN) · Vercel · optional shared Supabase

## Local

```bash
npm run dev
```

Open [http://localhost:4173](http://localhost:4173).

On iPhone Safari: Share → **Add to Home Screen** (works best over HTTPS / after Vercel deploy).

## Deploy on Vercel (own subdomain)

From this folder (CLI):

```bash
npx vercel --yes --prod --project mccolm-coin-chart
```

Or: push to GitHub → Vercel **Add New Project** → import (Framework: **Other** / static).  
You get something like `https://mccolm-coin-chart.vercel.app`.

(Folder name has spaces/capitals — always pass `--project mccolm-coin-chart`.)
4. **Custom subdomain** (recommended):
   - Vercel → Project → Settings → Domains
   - Add e.g. `coins.yourdomain.com` (or `coin-chart.yourdomain.com`)
   - Point DNS: CNAME `coins` → `cname.vercel-dns.com` (follow Vercel’s prompt)
5. In **The Ledger** Vercel project, set:

```bash
NEXT_PUBLIC_COIN_CHART_URL=https://coins.yourdomain.com
```

Redeploy The Ledger so the home-screen button opens Coin Chart.

## Same Supabase project (later)

Use The Ledger’s Supabase project URL + anon key. Keep Coin Chart data in its own tables (`coin_*`), no budget FKs. Until then, balances persist in **localStorage** on each device.

## Add to Home Screen

Open the Coin Chart URL in Safari (iPhone) or Chrome (Android) → Add to Home Screen. It installs as **Coin Chart** with its own icon — separate from The Ledger.
