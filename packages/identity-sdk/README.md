# `@identity-verification/sdk`

React building blocks for identity-style flows: address fields, phone input (E.164), selfie capture, validation helpers, and lightweight scoring utilities.

This package is developed inside the [Identity Verification SDK monorepo](../../README.md).

---

## Prerequisites (host apps)

Your app must already use:

- **React 18 or 19** and **React DOM** (peer dependencies)
- A bundler that resolves **pnpm workspace** packages and allows importing `@identity-verification/sdk/style.css`

---

## Use it from another monorepo package

### 1. Declare the workspace dependency

In the consuming app’s `package.json` (for example under `apps/`):

```json
{
  "dependencies": {
    "@identity-verification/sdk": "workspace:*"
  }
}
```

Run **`pnpm install` from the repository root** so pnpm links `packages/identity-sdk` into that app.

### 2. Build output (`dist/`) matters

Package `exports` point at **built files in `dist/`**, not TypeScript under `src/`. The host app consumes the SDK like any other dependency on disk.

- **One-off build** (from repo root):

  ```bash
  pnpm --dir packages/identity-sdk build
  ```

- **SkyRent demo** runs `predev` before Vite, so `pnpm dev` there usually builds the SDK for you on a fresh clone.

- **While editing the SDK often**, keep a watch build running in a second terminal:

  ```bash
  pnpm --dir packages/identity-sdk dev
  ```

  After each rebuild, refresh the host app if hot reload does not pick up changes.

### 3. Import JS and CSS

**Styles — where and how**

Add the SDK stylesheet **exactly once**, in the same module that bootstraps React (the file your `index.html` loads first—often `src/main.tsx` or `src/index.tsx`). Put it **above** your global app CSS if you rely on those rules to tweak or override SDK defaults.

```ts
import "@identity-verification/sdk/style.css";
```

If you omit `@identity-verification/sdk/style.css`, SDK controls still work, but they will **not** get the package’s intended spacing, borders, and field layout—expect a bare, mostly unstyled look.

**JavaScript / TypeScript**

Import components and helpers by package name (from route modules, hooks, etc.):

```ts
import {
  AddressForm,
  PhoneInput,
  SelfieCapture,
  validateAddress,
  isValidPhoneE164,
  getIdentityData,
} from "@identity-verification/sdk";
import type {
  IdentityInputs,
  IdentityData,
  IdentityAddress,
} from "@identity-verification/sdk";
```

## What this package exports (overview)

Grouped for scanning; the source of truth is **`src/index.ts`**.

| Area             | Symbols                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| UI               | `AddressForm`, `PhoneInput`, `SelfieCapture`                           |
| Address          | `validateAddress`, related error types                                 |
| Phone            | `isValidPhoneE164`                                                     |
| Identity payload | `getIdentityData`, `IdentityInputs`, `IdentityData`, and related types |
| Scoring          | `computeWeightedScore`, `scoreToStatus`                                |

**Integration note:** SDK field components are **form-agnostic** (no internal `<form>` or submit buttons). Your app owns layout, validation orchestration, and submit.

---

## Scripts (this package)

| Command      | What it does                                    |
| ------------ | ----------------------------------------------- |
| `pnpm build` | Production build into `dist/` (ESM, CJS, types) |
| `pnpm dev`   | Watch mode for local development                |
| `pnpm test`  | Vitest                                          |
| `pnpm lint`  | ESLint                                          |

From the monorepo root, prefix with a directory:

```bash
pnpm --dir packages/identity-sdk test
```
