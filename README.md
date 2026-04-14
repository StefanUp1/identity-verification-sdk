# Identity Verification SDK

Monorepo containing the `@identity-verification/sdk` package and a **SkyRent** demo app that exercises it.

## Repository layout

| Path | Description |
| ---- | ----------- |
| [`packages/identity-sdk`](packages/identity-sdk/README.md) | Publishable React SDK (`@identity-verification/sdk`) |
| [`apps/skyrent-demo`](apps/skyrent-demo/README.md) | Vite + React demo that consumes the SDK |

## Prerequisites

- [Node.js](https://nodejs.org/) (current LTS recommended). Node includes [Corepack](https://nodejs.org/api/corepack.html), which reads the root `packageManager` field and runs the matching **pnpm** version.
- **pnpm 10.x** — this repo pins `packageManager` to `pnpm@10.0.0`.

**Corepack (one-time per machine):** from any directory, run `corepack enable`, then use `pnpm` as usual from the repo root. If `pnpm` is not found, open a new terminal after enabling.

Alternatively, install [pnpm](https://pnpm.io/installation) 10 yourself and ensure it matches the pinned version when contributing or in CI.

## Install dependencies

From the repository root:

```bash
pnpm install
```

## Run the demo app

From the repository root:

```bash
pnpm dev
```

This starts the **skyrent-demo** Vite dev server. The demo’s `predev` script builds the SDK once before Vite starts, so the workspace package is ready to import.

When the server is up, open the URL shown in the terminal (by default Vite uses [http://localhost:5173](http://localhost:5173)).

### Run only the demo package

```bash
pnpm --filter skyrent-demo dev
```

## Other useful commands

| Command       | Description                                      |
| ------------- | ------------------------------------------------ |
| `pnpm build`  | Build all packages (`pnpm -r build`)             |
| `pnpm test`   | Run tests in all packages                        |
| `pnpm lint`   | Run ESLint in all packages                       |
