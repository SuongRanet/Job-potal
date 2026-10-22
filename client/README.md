# Client

Public job board for the job portal. Built with React 19, TypeScript, Vite, Tailwind CSS 4 and shadcn/Base UI components. Supports English and Khmer (i18next) and light/dark themes.

## Requirements

- Node.js 22+
- pnpm
- The [server](../server) API running (default `http://localhost:3000/api/v1`)

## Setup

```bash
pnpm install
pnpm dev
```

## Environment variables

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | API base URL (default `http://localhost:3000/api/v1`) |

Vite inlines this value at build time.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check and build to `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | Lint with Oxlint |

## Project structure

```
src/
├── components/   # Header, Footer, SearchBar, JobCard, JobDetail, ui/
├── hooks/        # useJobs, useLocations, useTheme, useDebouncedValue
├── i18n/         # English and Khmer translations
├── lib/          # Axios instance and helpers
└── pages/        # Pages
```

## Docker

The image serves the built app with nginx. `VITE_API_URL` must be passed at build time.

```bash
docker build --build-arg VITE_API_URL=https://your-api/api/v1 -t client .
docker run -p 8080:80 client
```
