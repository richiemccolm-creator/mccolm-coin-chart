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

## Same Supabase project as The Ledger

Coin Chart shares The Ledger’s Supabase project. Schema lives in `coin_*` tables only — **no foreign keys** into budget/`households` tables. The app syncs earn/spend/undo/reset over the anon key; localStorage stays as an offline cache.

| Path | Purpose |
|---|---|
| `supabase/migrations/20260726194500_coin_chart.sql` | Migration (CLI / `db push`) |
| `coin-chart-sync.sql` | Same SQL for Supabase → SQL Editor paste |

### 1. Apply the schema (once)

Paste `coin-chart-sync.sql` into the shared project’s SQL Editor and Run  
(or copy the migration into The Ledger’s `supabase/migrations/` and `npx supabase db push`).

| Table | Maps from app state |
|---|---|
| `coin_kids` | Sam / Isaac / Ben + `coins[slug]` balance |
| `coin_transactions` | `log[slug][]` earn/spend entries |

### 2. Env keys (same URL + anon key as The Ledger)

```bash
cp .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run build   # writes config.js + app.js
```

On Vercel (Coin Chart project): set the same two `NEXT_PUBLIC_SUPABASE_*` vars, then redeploy. Build runs `scripts/write-config.js` so `config.js` gets the keys.

Parent Settings shows sync status (Shared / Offline / This device only). If the cloud is empty and this device already has coins, the first successful connect uploads local data once.

## Add to Home Screen

Open the Coin Chart URL in Safari (iPhone) or Chrome (Android) → Add to Home Screen. It installs as **Coin Chart** with its own icon — separate from The Ledger.
