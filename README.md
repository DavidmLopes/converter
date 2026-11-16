# Converter

A small Next.js application for currency, length, volume, and weight conversions. The converter uses current shadcn/ui New York components, a neutral palette, and an animated light/dark theme switch.

## Development

Use Node.js 24 LTS and npm. With nvm:

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open <http://localhost:3000>.

All direct dependencies use exact versions. `.npmrc` sets `save-exact=true` for future npm installs; commit `package-lock.json` with dependency changes and use `npm ci` for reproducible installs.

## Commands

```sh
npm run lint          # ESLint flat configuration
npm run typecheck     # Generate Next.js route types and check TypeScript
npm test              # Calculation and API response validation tests
npx playwright install chromium  # One-time browser setup
npm run test:e2e      # Build and test production on desktop and mobile Chromium
npm run format:check
npm run format
npm run build
npm start
```

The browser tests mock exchange rates, so they don't depend on the external provider. They cover selections, inverse edits, swaps, category changes, failed requests/retries, theme persistence, and manifest icons. Tests run locally; no GitHub workflows are configured.

## Project structure

```text
src/
  app/                   App Router pages, layout, styles, and typed manifest
    api/rates/route.ts   Server endpoint for validated, cached exchange rates
  components/
    converter/           Currency and unit converter UI
    providers/           Theme provider
    ui/                  Shared Radix/shadcn UI primitives
    dark-mode-toggle.tsx
  hooks/                 Conversion state and client rate loading
  lib/                   Pure conversion helpers and shared utilities
tests/
  conversion.test.ts     Calculation and response validation tests
  e2e/                   Playwright interaction tests
public/favicon/          Existing icons
```

`src/app`, `src/components`, and `src/lib` remain standard Next.js conventions. Route files stay small, reusable UI stays separate, and conversion calculations can be tested without rendering React.

## Data and offline behavior

Currency rates come from FXRatesAPI through `/api/rates`. The server fetch caches successful upstream responses for one hour and times out after ten seconds. The client validates rates, cancels requests on unmount, and offers retry when loading fails. Changing tabs does not refetch rates.

Unit conversion uses local factors and needs no network once the app is loaded. The web manifest and icons support installation, but there is no service worker: cold starts without a connection are not guaranteed to work offline.

## Upgrade notes

- Next.js 16, React 19, Tailwind CSS 4, and current Radix packages replace the original stack.
- Tailwind uses CSS-based configuration and `@tailwindcss/postcss`; `tw-animate-css` supplies UI animations. The UI uses the current shadcn/ui neutral OKLCH tokens, component sizing, radii, and focus styles. Tailwind 4 requires Safari 16.4+, Chrome 111+, or Firefox 128+.
- TypeScript stays on 6.0.3 because the current TypeScript ESLint tooling supports versions below 6.1, rather than TypeScript 7.
- Next.js supports ESLint 10. Some bundled ESLint plugins still declare peer ranges through ESLint 9, so npm may print peer dependency warnings. The flat configuration is verified with ESLint 10; no `--force` or `--legacy-peer-deps` is needed.
- A scoped override pins TypeScript ESLint's transitive `minimatch` to 11.0.8 to address GHSA-g3hv-75wg-m249. Recheck this override when updating TypeScript ESLint. Linting and type checking are verified with it.
- Currency and unit results now recalculate when selections or rates change. Empty or unavailable rates no longer produce `NaN`.

References: [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure), [Next.js ESLint setup](https://nextjs.org/docs/app/api-reference/config/eslint), [Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

## shadcn/ui components

The nine components in `src/components/ui` were regenerated from the official registry with shadcn CLI 4.23.0 using the `new-york` style and `neutral` base color. They use React 19 component props, `data-slot` attributes, the unified `radix-ui` package, and the registry's `cn` helper. All direct dependency versions remain exact.

Add future components with the CLI, which reads `components.json`:

```sh
npx shadcn@4.23.0 add <component>
```

App-specific composition lives outside `components/ui`: full-width selects and popovers, form grid spacing, the card heading/action, and the animated theme toggle. The theme tokens live in `src/app/globals.css`; the old Tailwind 3 compatibility overrides have been removed.
