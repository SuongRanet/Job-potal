# Admin Page

Admin dashboard for the job portal. Built with React 19, TypeScript, Vite, Tailwind CSS 4, React Router and Zustand. Admins sign in to manage jobs and users.

## Requirements

- Node.js 22+
- pnpm
- The [server](../server) API running (default `http://localhost:3000`)

## Setup

```bash
pnpm install
pnpm dev
```

The dev server proxies `/api` to the backend. The API sets `SameSite=Strict` httpOnly cookies, so the admin and API must share one origin.

## Environment variables

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | API base URL (default `/api/v1`, same-origin via the proxy) |
| `VITE_API_PROXY` | Dev proxy target for `/api` (default `http://localhost:3000`) |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check and build to `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | Lint with Oxlint |

## Pages

| Route | Page |
| --- | --- |
| `/login` | Login |
| `/` | Dashboard |
| `/jobs`, `/jobs/new`, `/jobs/:id/edit` | List, create and edit jobs |
| `/users`, `/users/new`, `/users/:id/edit` | List, create and edit users |
| `/account` | Own account and password |

All routes except `/login` require authentication.

## Project structure

```
src/
├── components/   # Shell, brand, theme toggle, shared UI
├── lib/          # API client, resources, types, hooks, formatting
├── pages/        # Route pages
├── routes/       # Router and ProtectedRoute
└── store/        # Zustand stores (auth, toast)
```

## Docker

The image serves the built app with nginx and proxies `/api/` to the backend.

```bash
docker build -t admin-page .
docker run -p 8080:80 -e API_UPSTREAM=http://server:3000 admin-page
```
