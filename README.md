# Nature Nearby

Nature Nearby is a website that allows people to discover the plants, animals, fungi, etc. that are present at a given location. The data and photos comes from [iNaturalist](https://www.inaturalist.org), a platform that encourages people to observe and identify living organisms.

[Website](https://nature-nearby.dataexplorers.info)

## Tech stack

This site is built using JavaScript/TypeScript, custom web components, CSS, and HTML. I tried to keep third party library to a minimum. This site uses [Leaflet](https://leafletjs.com/) (maps) and[Autocomplete.js](https://tarekraafat.github.io/autoComplete.js/) (autocomplete search).

For development, this app uses [Vite.js](https://vite.dev/) for the build tool, [Vitest](https://vitest.dev/) for testing, and [Prettier](https://prettier.io) for formatting.

I did not use AI prompts or vibe coding to build this site.

## Install

Download the repo.

Install libraries.

```bash
npm install
```

Copy `env.sample`, and rename it `.env.local`

Start Vite.js server

```bash
npm run dev
```
