# 🫀 PingFlow

**Keep your free-tier backend services awake — for free.**

Free-tier hosts like Render and Railway put idle web services to sleep, which makes the
first request after a quiet spell painfully slow. PingFlow fixes that without a server of
its own: it reads your service URLs from a JSON file and a scheduled **GitHub Action** pings
them every 10 minutes, so your backend is always warm when a real user shows up.

- ✅ **100% free** — runs on the GitHub Actions free tier
- ✅ **No backend, no database, no auth** — config lives in `services.json`
- ✅ **GitHub powered** — a single workflow does all the work
- ✅ **Open source** — fully transparent, fork it and go

It's a frontend-only React app (the marketing site + dashboard) plus one workflow file.

---

## 🧱 Tech stack

| Layer       | Choice                                  |
| ----------- | --------------------------------------- |
| Framework   | React + Vite                            |
| Language    | JavaScript (no TypeScript)              |
| Styling     | Tailwind CSS                            |
| Animation   | Framer Motion                           |
| Icons       | Lucide React                            |
| Automation  | GitHub Actions                          |
| Deploy      | Vercel                                  |

No Express, no Node server, no API routes, no serverless functions.

---

## 📂 Project structure

```text
pingflow/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/        # Navbar, Hero, Stats, Features, HowItWorks,
│   │                      # ServicesDashboard, FAQ, Footer, PulseLine…
│   ├── pages/
│   │   └── Home.jsx
│   ├── data/
│   │   └── services.json  # ← your list of services
│   ├── config.js          # repo URL + ping interval constants
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── ping.mjs           # the pinger the workflow runs
├── .github/
│   └── workflows/
│       └── ping-services.yml
└── package.json
```

---

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Build for production
npm run build && npm run preview
```

Open the printed local URL (usually <http://localhost:5173>).

---

## 🔎 Check & add from the site

The **Try it** section lets a visitor paste a backend URL and:

- **Check response** — pings the URL live, in the browser, and reports reachability + response
  time. Because browsers enforce CORS, endpoints without CORS headers come back as *"Reachable
  (status hidden)"* rather than a status code — that's a browser rule, not a bug. The GitHub
  Action runs server-side and always reads the true status.
- **Add** — posts to `/api/add-service`, a Vercel serverless function that validates the endpoint
  and **commits it to `services.json` instantly**. No GitHub account, no issue, no copy-paste.

### Instant add via the Vercel function

`api/add-service.js` runs server-side and commits with a GitHub token kept in a **Vercel env var**
— so the token is never shipped to the browser (the safe alternative to a client-side token). It
**only accepts** a service that is a valid **`https`** URL, **reachable** (responds < 500), **not a
duplicate**, and within the list cap (100). Shared guardrails live in `api/_lib/validate.js`; the
commit logic in `api/_lib/github.js`.

**Required Vercel environment variables** (Project → Settings → Environment Variables):

| Variable | Value |
| --- | --- |
| `GITHUB_TOKEN` | Fine-grained PAT, **Contents: Read and write** on your repo |
| `GITHUB_OWNER` | e.g. `hari10031` |
| `GITHUB_REPO` | e.g. `pingflow` |
| `GITHUB_BRANCH` | `main` |
| `SERVICES_PATH` | `src/data/services.json` |
| `WAKE_SECRET` | *(optional)* gate for `/api/wake` |

> The `vercel.json` rewrite excludes `/api/` (`"/((?!api/).*)"`) so the functions are reachable
> while the SPA still handles everything else. Each add commits → Vercel redeploys (~1 min) before
> the dashboard reflects it.

### Wake on demand — `/api/wake`

`GET /api/wake` pings every service in the list and returns a status + latency summary;
`GET /api/wake?url=https://…` pings just one. Hit it manually or from an uptime monitor to warm
services any time. The every-10-minute schedule still runs in GitHub Actions
(`ping-services.yml`) — free and frequent, whereas Vercel Hobby crons only run once per day.

### Local testing

Plain `npm run dev` (Vite) does **not** serve `/api/*`. Use the Vercel CLI:

```bash
npm i -g vercel
vercel dev      # serves the site + the functions, with your linked env vars
```

### GitHub-issue fallback (optional)

The older issue-based flow still works if someone files an `Add service:` issue
(`.github/workflows/auto-add-service.yml` + `scripts/add-from-issue.mjs`). Keep it as a no-account
path, or delete those files for a single add route.

## ➕ Adding a service manually

Edit `src/data/services.json` and add an entry with a `name` and a health `url`:

```json
[
  {
    "name": "Portfolio API",
    "url": "https://example.onrender.com/health"
  },
  {
    "name": "Workshop API",
    "url": "https://example.up.railway.app/health"
  }
]
```

Commit and push. That's the whole "deploy" — the dashboard re-renders from the file and the
workflow starts pinging the new URL on its next run.

> Tip: point at a lightweight `/health` (or `/healthz`) endpoint rather than your homepage so
> the wake-up ping stays cheap.

---

## ⏰ How the pinging works

`.github/workflows/ping-services.yml` runs on a cron schedule:

```yaml
on:
  schedule:
    - cron: '*/10 * * * *' # every 10 minutes
  workflow_dispatch: # plus a manual "Run workflow" button
```

Each run executes `scripts/ping.mjs`, which:

1. Reads `src/data/services.json`
2. Loops through every service
3. Pings each URL (15s timeout)
4. **Retries failures up to 3 times** with backoff
5. **Continues on failure** so one dead service never blocks the others
6. Logs response **status** and **response time** for every attempt

Run it locally anytime with:

```bash
npm run ping
```

### Changing the interval

Edit the cron expression in the workflow (`*/10` → `*/5` for every 5 minutes, etc.) and update
`PING_INTERVAL_MINUTES` in `src/config.js` so the UI copy matches.

> GitHub note: scheduled workflows only run on the **default branch**, and the schedule can be
> delayed a few minutes under load. Both are normal for free Actions.

---

## ☁️ Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel — it auto-detects Vite and the `api/` functions.
3. Add the environment variables from the table above (needed for the **Add** function).
4. Deploy.

The pinging schedule runs in **GitHub Actions**, independent of where the site is hosted; the
`api/` functions handle instant adds and on-demand wakes.

---


---

## 📄 License

MIT — use it, fork it, ship it.
