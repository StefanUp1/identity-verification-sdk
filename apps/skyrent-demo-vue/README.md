# SkyRent demo (Vue)

Vue + Vite host application that mirrors the React SkyRent demo UI/flow while consuming SDK controls through Web Components.

## Run

From monorepo root:

```bash
pnpm dev:vue
```

Or from this directory:

```bash
pnpm dev
```

The `predev` hook builds `packages/identity-sdk` first so `@identity-verification/sdk/web-components` is available.
