# Identity Verification SDK

Monorepo containing the `@identity-verification/sdk` package and a **SkyRent** demo app that exercises it.

## Repository layout

| Path                                                       | Description                                          |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| [`packages/identity-sdk`](packages/identity-sdk/README.md) | Publishable React SDK (`@identity-verification/sdk`) |
| [`apps/skyrent-demo`](apps/skyrent-demo/README.md)         | Vite + React demo that consumes the SDK              |

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

## Development

From the repository root:

| Script         | Description                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`     | **skyrent-demo** — Vite dev server. The demo’s `predev` builds the SDK once before Vite starts.                              |
| `pnpm dev:sdk` | **identity-sdk** — `tsup` watch rebuild of `@identity-verification/sdk` (use alongside `dev` when you change the SDK often). |

**Demo only:**

```bash
pnpm dev
```

When the server is up, open the URL shown in the terminal (by default Vite uses [http://localhost:5173](http://localhost:5173)).

**SDK watch in a second terminal** (optional, while editing `packages/identity-sdk`):

```bash
pnpm dev:sdk
```

After each rebuild, refresh the host app if hot reload does not pick up changes.

Equivalent filters (if you prefer not to use the root scripts):

```bash
pnpm --filter skyrent-demo dev
pnpm --filter @identity-verification/sdk dev
```

## Other useful commands

| Command      | Description                          |
| ------------ | ------------------------------------ |
| `pnpm build` | Build all packages (`pnpm -r build`) |
| `pnpm test`  | Run tests in all packages            |
| `pnpm lint`  | Run ESLint in all packages           |
