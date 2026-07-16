# BethGold Foundation

Monorepo with two independent apps:

```
site/    Astro 6 marketing site — currently deployed to GitHub Pages
studio/  Sanity Studio — content admin, deployed to https://bethgold-foundation.sanity.studio/
```

They share nothing but this repo — no shared build step, no shared `package.json`. `site/` reads content from Sanity via `@sanity/astro`; `studio/` is where that content gets authored.

## Running in dev

Each app is installed and run independently.

```sh
# Astro site — http://localhost:4321
cd site
npm install
npm run dev

# Sanity Studio — http://localhost:3333
cd studio
npm install
npm run dev
```

Both apps read Sanity project settings from env vars — copy `.env.example` to `.env` in each folder. Real project: ID `9izf3au6`, dataset `production` (see https://www.sanity.io/manage). `.env` is gitignored in both folders, so a fresh clone needs these filled in before `npm run dev` can talk to the real project — placeholder values still let both apps boot locally without them.

## Deploying `site/` to Netlify

Not yet set up (no Netlify account/site exists yet) — once you create one, connect this repo with:

- **Base directory:** `site`
- **Build command:** `npm run build`
- **Publish directory:** `site/dist`
- **Environment variables:** `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`

**Before that switch is live**, `site/astro.config.mjs` still has `base: '/BGF'` and `site: 'https://sirret.github.io'` — settings specific to the current GitHub Pages deployment. Once Netlify is the real deploy target, update those to `base: '/'` and `site: '<your-netlify-url>'`, otherwise every internal link will be wrongly prefixed with `/BGF` on Netlify. At that point `.github/workflows/deploy.yml` (the GitHub Pages workflow) should also be disabled or removed so the two don't fight over which is "production."

This is also the point where the Web3Forms → Netlify Forms migration (see `site/CLAUDE.md`) becomes unblocked, since Netlify Forms only works when Netlify itself builds the site.

## Deploying `studio/`

Live at **https://bethgold-foundation.sanity.studio/**. Not embedded in the Astro app, no `studioBasePath` is configured.

To push schema/config changes to it:

```sh
cd studio
npx sanity deploy
```

The app ID is pinned in `sanity.cli.ts` (`deployment.appId`), so this won't re-prompt for a hostname on subsequent deploys.
