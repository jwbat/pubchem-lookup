# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page React app that lets users search PubChem for chemical compound structures by name, IUPAC name, abbreviation, or CID number. Displays up to 5 compounds at a time as cards with 2D structure images and molecular metadata.

## Tech Stack

- React 19 + Vite 6
- No state management library — all state lives in `App.jsx` via `useState`
- No backend — all data fetched directly from the PubChem REST API
- Deployed to GitHub Pages at `https://jwbat.github.io/pubchem-lookup`

## Architecture

The entire app is one component (`src/App.jsx`). The data flow:

1. User types a name or CID into the search input (or clicks a quick-look chip)
2. `lookup()` resolves the term to a PubChem CID (skips the name→CID step if input is numeric)
3. `fetchByCid()` fetches `IUPACName`, `MolecularFormula`, `MolecularWeight` from the PubChem PUG REST API
4. Structure images are served directly from PubChem as PNG URLs embedded in `<img>` tags — no local processing

`pubchem_lookup.html` is the original vanilla-JS prototype, kept for reference only.

The `base` in `vite.config.js` is set to `/pubchem-lookup/` for GitHub Pages routing.

## Commands

```bash
npm run dev       # start dev server (opens browser automatically)
npm run build     # production build → dist/
npm run preview   # preview production build locally
npm run deploy    # build + push dist/ to gh-pages branch
```
