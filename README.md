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

## Deploying `site/`

Deploys to **GitHub Pages** via `.github/workflows/deploy.yml` on every push to `main`, plus a `repository_dispatch` trigger fired by a Sanity webhook whenever content is published in Studio (see `studio/scripts/setup-webhook.ts`) — so a rebuild happens automatically on both a code change and a content change, no manual step either way.

A move to Netlify was considered at one point (to unblock a Netlify Forms migration) but that plan was dropped — forms stay on Web3Forms permanently (see `site/CLAUDE.md`), and GitHub Pages is the permanent deploy target. Don't reintroduce Netlify hosting/deploy config unless explicitly asked again.

## Deploying `studio/`

Live at **https://bethgold-foundation.sanity.studio/**. Not embedded in the Astro app, no `studioBasePath` is configured.

To push schema/config changes to it:

```sh
cd studio
npx sanity deploy
```

The app ID is pinned in `sanity.cli.ts` (`deployment.appId`), so this won't re-prompt for a hostname on subsequent deploys.
