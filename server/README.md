# Server

REST API for the job portal, built with Express 5, TypeScript and MongoDB (Mongoose). Authentication uses JWT access/refresh tokens stored in httpOnly cookies. Passwords are hashed with Argon2.

## Requirements

- Node.js 22+
- pnpm
- A MongoDB instance

## Setup

```bash
pnpm install
cp .env.example .env   # or create .env manually (see below)
pnpm dev
```

The server listens on `PORT` (default `3000`) and serves everything under `/api/v1`.

## Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | Port to listen on (default `3000`) |
| `NODE_ENV` | `development` or `production` (affects cookie settings) |
| `CLIENT_URL` | Allowed CORS origin for the public client |
| `ADMIN_URL` | Allowed CORS origin for the admin page |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Credentials used by `create-admin` |
| `ADMIN_FIRST_NAME`, `ADMIN_LAST_NAME` | Optional names for `create-admin` (default `Admin` / `User`) |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run with `tsx watch` |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm start` | Run the compiled server |
| `pnpm typecheck` | Type-check without emitting |
| `pnpm create-admin` | Create the first admin user (uses `ADMIN_*` env vars) |
| `pnpm create-admin:prod` | Same, from compiled output |

There is no self-registration: create the first admin with `create-admin`, then add further users via `POST /users`.

## API

Base path: `/api/v1`. 🔒 = requires authentication (every authenticated user is an admin).

### Auth
| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/login` | Log in, sets auth cookies |
| POST | `/auth/refresh` | Refresh the access token |
| POST | `/auth/logout` | Log out |
| GET | `/auth/me` 🔒 | Own profile |
| GET | `/auth/getUser/:id` 🔒 | Get a user by ID |

### Users 🔒
| Method | Path | Description |
| --- | --- | --- |
| GET | `/users/me` | Current user |
| PATCH | `/users/me` | Update current user |
| PATCH | `/users/me/password` | Change own password |
| POST | `/users` | Create a user |
| GET | `/users` | List users |
| GET | `/users/:id` | Get a user |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

### Jobs
| Method | Path | Description |
| --- | --- | --- |
| GET | `/jobs` | List jobs (public) |
| GET | `/jobs/:id` | Get a job (public) |
| GET | `/jobs/manage` 🔒 | List all jobs for management |
| POST | `/jobs` 🔒 | Create a job |
| PATCH | `/jobs/:id` 🔒 | Update a job |
| DELETE | `/jobs/:id` 🔒 | Delete a job |

### Other
| Method | Path | Description |
| --- | --- | --- |
| GET | `/locations` | List locations (public) |
| GET | `/dashboard` 🔒 | Dashboard statistics |

## Project structure

```
src/
├── app.ts            # Express app, CORS, middleware, route mounting
├── server.ts         # Entry point: connects to MongoDB, starts the server
├── config/           # Database connection
├── middleware/       # Auth middleware
├── module/           # Feature modules: auth, users, jobs, locations, dashboard
│                     #   each with route / controller / service / repository / model / schema
└── scripts/          # createAdmin
```

## Docker

```bash
docker build -t server .
docker run --env-file .env -p 3000:3000 server
```
