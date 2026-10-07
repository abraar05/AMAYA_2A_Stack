# 2A-Stack — IMEI Control Center (AMAYA Industries)

Synthetic demo of the AMAYA IMEI Control Center. Every identifier, event and count is **fabricated** — this is not AMAYA inventory data.

Built with the same design system and shell as the Nexus suite apps (NexusDistro, NexusPeople, NexusLogistics, NexusPortal, NexusCRM): dark panel UI, sidebar navigation, module grid, light/dark toggle, AI drawer, PWA offline cache. **Self-contained static app — no build step, no framework, no runtime dependencies.**

## Modules (mirrored from https://imei-control-center.pages.dev/)

- **Overview** — totals, health KPIs, quick jumps
- **IMEI Search** — jump to an identifier's evidence trail
- **Asset Ledger** — latest resolved state per device, state filters, CSV export
- **Movement Evidence** — every occurrence across source tabs, TSV export
- **Review Queue** — conflicts needing human review, approve/reject with local audit state
- **Import / Export** — JSON bundle import/export, restore bundled snapshot
- **Methodology** — how a device is resolved, known limits
- **Account** — session, sign out, appearance

## Run locally

```sh
npm start          # http://127.0.0.1:8810
npm run check      # syntax-check the JS
```

## Demo credentials

- Email: `admin@2astack.app`
- Password: `Stack@2026`
- Analyst: `analyst@2astack.app` / `Stack@2026`

## Deploy (GitHub Pages)

1. Create a GitHub repo (e.g. `AMAYA_2A_Stack`) and push this folder.
2. **Settings → Pages → Source: GitHub Actions**.
3. `.github/workflows/pages.yml` deploys on every push to `main`.
