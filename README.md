# PubChem Structure Lookup

A React app for looking up chemical compound structures via the PubChem API.

## Project Structure

```
PubChemLookup/
├── index.html          ← Vite entry point
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx        ← React root mount
│   ├── App.jsx         ← all app logic as a React component
│   └── index.css       ← ported styles (id → class selectors)
└── pubchem_lookup.html ← original, kept for reference
```

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
