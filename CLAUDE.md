# CLAUDE.md — Joint Venture

## Project Overview

Next.js 14 + Sanity CMS monorepo. Two separate package contexts:

- **Root** (`/`) — Next.js app. Sources live in `src/`.
- **Studio** (`/studio/`) — Sanity Studio v3 app. Sources live in `studio/`.

## Key Commands

```bash
# Root
pnpm install
pnpm dev          # runs next dev + sanity dev in parallel
pnpm build        # runs generate:sanity, then next build + sanity build
pnpm format       # prettier

# Studio (cd studio first)
pnpm dev
pnpm build
```

---

## Unused Package Audit — Workflow

The goal is to find every package listed in `package.json` and
`studio/package.json` that is **never actually imported or required** anywhere
in the source tree, then safely remove it.

Work through each package list systematically using the steps below.

---

### Step 1 — Establish search scopes

| Package file           | Source files to scan                                                                                                                                | Config files to also scan                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/package.json`        | `src/**`                                                                                                                                            | `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `sanity-codegen.config.ts`, `wdyr.ts`, `lint-staged.config.js`, `.eslintrc*`, `.stylelintrc*`, `tsconfig.json` |
| `/studio/package.json` | `studio/schemas/**`, `studio/lib/**`, `studio/parts/**`, `studio/plugins/**`, `studio/config/**`, `studio/sanity.config.ts`, `studio/sanity.cli.ts` | `studio/postcss.config.js`, `studio/.eslintrc*`, `studio/tsconfig.json`                                                                                                     |

---

### Step 2 — For each package, search for usage

Use `grep_search` (or `grep -r`) to look for the package name as an import
string.

**Search patterns to try for a package named `<pkg>`:**

```
from '<pkg>'
from "<pkg>"
require('<pkg>')
require("<pkg>")
import '<pkg>'
import "<pkg>"
```

Also check for **namespace/scoped imports** — for `@org/pkg`, search for
`from '@org/pkg` as well as `'@org/pkg/`.

**Special non-import usages to check:**

| Package                                 | Where to look                                                |
| --------------------------------------- | ------------------------------------------------------------ |
| `autoprefixer`                          | `postcss.config.js`                                          |
| `postcss-*`                             | `postcss.config.js`                                          |
| `tailwindcss`                           | `postcss.config.js`, `tailwind.config.ts`                    |
| `tailwindcss-animate`                   | `tailwind.config.ts` (plugins array)                         |
| `stylelint*`                            | `.stylelintrc*` or `stylelint.config.*`                      |
| `eslint*`                               | `.eslintrc*` or `eslint.config.*`                            |
| `prettier`                              | `.prettierrc*`, `lint-staged.config.js`, scripts             |
| `husky`                                 | `.husky/`, `package.json` prepare script                     |
| `lint-staged`                           | `lint-staged.config.js`, `package.json` scripts              |
| `is-ci`                                 | `package.json` scripts                                       |
| `rimraf`                                | `package.json` scripts                                       |
| `npm-run-all`                           | `package.json` scripts                                       |
| `sharp`                                 | Next.js image optimisation — used implicitly, never imported |
| `sanity-codegen`                        | `sanity-codegen.config.ts`, `package.json` scripts           |
| `@sanity/cli`                           | CLI only — used via `sanity` binary                          |
| `@welldone-software/why-did-you-render` | `wdyr.ts`                                                    |
| `focus-visible`                         | May be imported in `src/styles/` or a global CSS entry       |
| `fs`                                    | Node built-in shim — check `next.config.js` webpack aliases  |
| `schema-dts`                            | Check for `import type` usage (types-only)                   |
| `csstype`                               | Type-only, check tsconfig paths and type imports             |
| `babel-loader`                          | `next.config.js` webpack config                              |
| `webpack`                               | `next.config.js` webpack config                              |

---

### Step 3 — Categorise each package

After searching, assign one of:

- **USED** — found in at least one import or config reference
- **IMPLICIT** — framework convention, never imported directly (e.g. `sharp`,
  `@sanity/cli`, `husky`, `is-ci`, CLI devDeps)
- **CANDIDATE** — no evidence of usage found; flag for removal
- **NEEDS VERIFICATION** — ambiguous (e.g. re-exported via barrel, injected by a
  plugin)

---

### Step 4 — Verify candidates before removing

Before removing a **CANDIDATE**:

1. Check if the package is a **peer dependency** of another installed package.
2. Check if it is re-exported through a barrel file (`index.ts`) without an
   explicit import of its own.
3. Check if it appears in any CI/CD config, Docker file, or Vercel config
   (`vercel.json`).
4. Check `pnpm-lock.yaml` — if the package only appears as a transitive dep of
   another package, removing it from `package.json` is safe.

Only remove when confident. When uncertain, leave a `# TODO: verify` comment in
this file.

---

### Step 5 — Remove and verify build

After removing candidates from `package.json` or `studio/package.json`:

```bash
pnpm install          # re-resolve lockfile
pnpm build            # full build — catches missing imports
```

Fix any build errors before committing.

---

## Known Potential Redundancies (pre-analysis hints)

These are worth examining early — some may be duplicates or very low usage:

### Root `/package.json`

| Package                               | Suspicion                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| `classnames` vs `clsx`                | Both do the same thing — check which is actually imported                         |
| `@iconify/icons-cib` vs `react-icons` | Two icon libraries — check which pages/components use each                        |
| `groq`                                | May be superseded by the `groq` re-export inside `sanity` or `@sanity/client`     |
| `fs` (`0.0.1-security`)               | Node built-in shim — check if Next.js config or API routes truly need it listed   |
| `schema-dts`                          | Types only — confirm it's used in structured data components                      |
| `react-rough-notation`                | Niche animation lib — grep for `RoughNotation`                                    |
| `react-scroll`                        | Scroll utility — grep for `react-scroll`                                          |
| `react-cookie`                        | Cookie utility — grep for `react-cookie`                                          |
| `react-device-detect`                 | Device detection — grep for `react-device-detect`                                 |
| `react-transition-group`              | May be replaced by framer-motion — grep for `TransitionGroup`                     |
| `@sanity/ui`                          | Used in Next.js app? Or only needed in studio?                                    |
| `@sanity/icons`                       | Same question as above                                                            |
| `dotenv`                              | Next.js handles `.env` natively — check if explicitly called                      |
| `cors`                                | API route utility — grep `src/pages/api/`                                         |
| `babel-loader`                        | Check if `next.config.js` has a custom webpack/babel config                       |
| `webpack`                             | Same as above                                                                     |
| `csstype`                             | Type-only — check imports                                                         |
| `postcss-hexrgba`                     | PostCSS plugin — verify `postcss.config.js`                                       |
| `stylelint*` (3 packages)             | Check if stylelint is actually configured and run                                 |
| `@commitlint/*` (3 packages)          | Check `.husky/commit-msg` hook and `commitlint.config.*`                          |
| `@next/bundle-analyzer`               | Check `next.config.js` for `withBundleAnalyzer`                                   |
| `@asbjorn/eslint-plugin-groq`         | Check `.eslintrc*`                                                                |
| `sanity-codegen`                      | Check if `generate:sanity` script is still being used; `gen/` folder may be stale |

### Studio `/studio/package.json`

| Package                      | Suspicion                                                             |
| ---------------------------- | --------------------------------------------------------------------- |
| `prop-types`                 | React 18 / TypeScript project — rarely needed                         |
| `lodash`                     | Grep for `lodash` — may only use one or two methods                   |
| `@sanity/production-preview` | Check `studio/parts/resolve-production-url.ts` and `sanity.config.ts` |
| `@sanity/components`         | Older Sanity v2 package — verify it's needed with Sanity v3           |
| `@typescript-eslint/parser`  | Check `studio/.eslintrc*`                                             |
| `eslint-config-next`         | Studio shouldn't need Next.js ESLint config                           |
| `eslint-plugin-react-hooks`  | Check `.eslintrc*`                                                    |
| `styled-components`          | Check if any studio schemas/components import it                      |
| `react-is`                   | Peer dep of some libs — check if directly imported                    |
| `slugify`                    | Grep for `slugify` in studio source                                   |

---

## File Tree Reference

```
/
├── package.json                  ← ROOT deps
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── sanity-codegen.config.ts
├── wdyr.ts
├── lint-staged.config.js
├── tsconfig.json
├── vercel.json
├── src/
│   ├── components/               ← React components — main import source
│   ├── contexts/
│   ├── globals/
│   ├── hooks/
│   ├── lib/
│   ├── middleware.ts
│   ├── pages/                    ← Next.js pages + API routes
│   └── styles/                   ← CSS — check for bare @imports of JS packages
└── studio/
    ├── package.json              ← STUDIO deps
    ├── sanity.config.ts          ← Plugin registrations live here
    ├── sanity.cli.ts
    ├── schemas/                  ← Sanity schema definitions
    ├── lib/                      ← Studio utilities
    ├── parts/                    ← Custom desk structure, preview URL
    └── plugins/                  ← Any local Sanity plugins
```

---

## Safety Rules

1. **Never remove** `react`, `react-dom`, `next`, `sanity`, `typescript` —
   always required.
2. **Never remove** packages referenced only in `pnpm-lock.yaml` as transitive
   deps — those are fine to omit from `package.json`.
3. **Always run `pnpm build`** after removals before marking the task done.
4. When in doubt, comment out the line in `package.json` and rebuild instead of
   deleting outright — easier to revert.
