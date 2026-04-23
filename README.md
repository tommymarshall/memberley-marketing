# Memberley Marketing

Static marketing site for [memberley.com](https://memberley.com). Built with [Astro](https://astro.build) + Tailwind CSS v4.

The app itself lives in the separate `memberley-app` repo and is deployed to `app.memberley.com`. All CTAs on this site link to the app for sign-in / signup flows.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:4321.

## Build

```bash
npm run build        # outputs to ./dist
npm run preview      # preview the production build locally
```

## Deploy

Deploy the `dist/` directory to any static host. Recommended: Vercel or Netlify — both auto-deploy on push.

### Vercel

1. Import the repo in Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Point `memberley.com` at the Vercel project.

## Structure

```
src/
├── layouts/
│   └── Layout.astro        # html shell, fonts, meta tags
├── pages/
│   └── index.astro         # landing page
└── styles/
    └── global.css          # tailwind + design tokens
public/
└── favicon.svg
```

## App links

CTAs on this site point to the Laravel app:

- Sign in: `https://app.memberley.com/login`
- Create org / signup: `https://app.memberley.com/organization-signup`

Update these in `src/pages/index.astro` (top of frontmatter) if the app URL changes.
