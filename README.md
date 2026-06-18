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
- **Submit a service** — opens a **pre-filled GitHub issue** with the name and URL already entered.
  A maintainer reviews it and, if it's good, adds it to `services.json`. No token, no signup, no
  backend — the visitor just needs a GitHub account to file the issue.

### Why submissions instead of direct writes?

A public, frontend-only site **can't store URLs that strangers submit** — there's no database, and
the browser can't write to the repo without a secret token (which can't be exposed publicly). So
the public path is **propose → review → merge**: visitors submit, you approve. That keeps every
rule intact (no backend, no database, no auth) while still letting anyone request a service.

### For maintainers: approving a submission

1. A submission arrives as a GitHub issue (via `.github/ISSUE_TEMPLATE/add-service.yml`).
2. Sanity-check the URL (the **Check response** button on the site helps).
3. Add the entry to `src/data/services.json` and commit — that's the approval.
4. Close the issue. The next workflow run begins pinging it.

> Set `GITHUB_REPO` in `src/config.js` to your repo so the **Submit** button points at the right
> issue tracker.

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
2. Import it in Vercel — it auto-detects Vite (`vercel.json` is included as a fallback).
3. Deploy. No environment variables required.

The pinging happens in **GitHub Actions**, independent of where the site is hosted.

---


---

## 📄 License

MIT — use it, fork it, ship it.
