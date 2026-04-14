# SkyRent demo

React + Vite host application that demonstrates integrating **`@identity-verification/sdk`** in a realistic checkout-style flow (browse, verification, checkout, result).

This package is part of the [Identity Verification SDK monorepo](../../README.md). Install dependencies from the **repository root** unless you already have a linked workspace install.

## Prerequisites

Same as the monorepo: Node.js (LTS recommended) and **pnpm 10.x**. See the [root README](../../README.md).

## Install

From the monorepo root:

```bash
pnpm install
```

## Run the dev server

**Recommended** (from monorepo root, uses the root `dev` script):

```bash
pnpm dev
```

**From this app directory** (`apps/skyrent-demo`):

```bash
pnpm dev
```

Before Vite starts, the `predev` script builds `packages/identity-sdk` once so the workspace dependency resolves to built `dist/` output. The demo imports SDK styles in `src/main.tsx`:

```ts
import "@identity-verification/sdk/style.css";
```

Open the URL Vite prints (default [http://localhost:5173](http://localhost:5173)).

## Scripts

| Script         | Description                                 |
| -------------- | ------------------------------------------- |
| `pnpm dev`     | Build SDK (predev) then start Vite with HMR |
| `pnpm build`   | Typecheck and production build              |
| `pnpm preview` | Serve the production build locally          |
| `pnpm test`    | Run Vitest                                  |
| `pnpm lint`    | Run ESLint                                  |

## Related

- [Identity Verification SDK package](../../packages/identity-sdk/README.md)
