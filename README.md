# SETABASE website

The public site for SETABASE Services (property management, facility management, corporate
relocation, special services and real estate in New Cairo), plus an admin dashboard at
`/admin` for the requests the site receives and the packages it sells.

Built with Next.js 16 (App Router), React 19, Tailwind 4, shadcn/ui (Base UI), MongoDB via
Mongoose, zod and GSAP.

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill it in — see below
npm run dev
```

The site runs at http://localhost:3000 and the dashboard at http://localhost:3000/admin.

Without `MONGODB_URI` the public pages still work on their built-in catalog, but package
requests are only logged to the console and the dashboard can't load.

## Environment variables

| Variable               | What it is                                                                      |
| ---------------------- | ------------------------------------------------------------------------------- |
| `MONGODB_URI`          | MongoDB connection string (MongoDB Atlas works well with Vercel).               |
| `AUTH_SECRET`          | Signs the admin session cookie. At least 32 random characters.                  |
| `ADMIN_EMAIL`          | The one admin account's email.                                                  |
| `ADMIN_PASSWORD_HASH`  | bcrypt hash of the admin password — see below (`$` written as `\$` in `.env.local`). |
| `NEXT_PUBLIC_SITE_URL` | Public URL, for canonical links and the sitemap.                                |

On Vercel, add each one under **Settings → Environment Variables**. Never commit `.env.local`.

### The admin password

```bash
npm run admin:hash -- "your password"
```

prints an `ADMIN_PASSWORD_HASH=` line and a fresh `AUTH_SECRET=` line ready to paste into
`.env.local`. The hash's `$` signs appear as `\$` there on purpose: Next.js expands `$VAR`
inside `.env` files and would otherwise strip most of the hash. For Vercel the script also
prints the plain values, which is what its environment settings expect.

If sign-in says it isn't configured, the server log says which of the two is wrong.

### The packages

The packages from the departments PDF were loaded into the project's MongoDB Atlas database
once; from here on they are managed in the dashboard. A database that is reachable but empty
shows no packages on the public pages — add them under Special Offers and Corporate
Relocation. Without any database the public pages fall back to the built-in catalog in
`src/content/`.

## The dashboard

- `/admin/login` — one account, from the env vars above. Five failed attempts in fifteen
  minutes locks the IP out for the rest of the window.
- `/admin/requests` — every request from the Special Services and Corporate Relocation
  pages, with status, notes, filters and search.
- `/admin/special-offers` — the Special Services catalog. Saving a package updates the
  public page right away.
- `/admin/corporate-relocation` — the Corporate Relocation stages and extras.
- `/admin/team` — who can sign in. Add members with an email and password, edit them, set
  a new password, switch them off, or remove them. The account from the env vars is shown
  there too; it always works, so a team can't lock itself out.

Sessions are a signed JWT in an httpOnly cookie, valid for seven days. `src/proxy.ts` keeps
guests out of `/admin`; the dashboard layout and every `/api/admin/*` route then check that
the account behind the cookie still exists and is active, so removing a member or changing
their password signs them out at once.

## API

Public, used by the website:

| Route                       | Does                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `POST /api/requests`        | Stores a package request. Validates against the live catalog, prices on the server. |
| `GET /api/special-offers`   | Active Special Services offers.                                                     |
| `GET /api/corporate-relocation` | Active Corporate Relocation packages.                                           |
| `POST /api/contact`         | The general contact form (logs only, for now).                                      |

Admin, cookie required (`401` otherwise):

| Route                                           | Does                                        |
| ----------------------------------------------- | ------------------------------------------- |
| `POST /api/admin/auth/login`, `…/logout`        | Sign in and out.                            |
| `GET /api/admin/requests`                       | `?service=&status=&search=&page=&pageSize=` |
| `GET/PATCH/DELETE /api/admin/requests/:id`      | `PATCH` takes `status` and `adminNotes`.    |
| `GET/POST /api/admin/special-offers`            |                                             |
| `GET/PATCH/DELETE /api/admin/special-offers/:id`|                                             |
| `GET/POST /api/admin/corporate-relocation`      |                                             |
| `GET/PATCH/DELETE /api/admin/corporate-relocation/:id` |                                      |
| `GET/POST /api/admin/team`                      | Team members; `POST` takes `email`, `password`, optional `name`. |
| `GET/PATCH/DELETE /api/admin/team/:id`          | `PATCH` takes any of `name`, `email`, `password`, `isActive`. |

Every response is `{ data }` or `{ error: { message, fields? } }`.

## Where things live

```
src/app/                 pages and API routes
src/app/admin/           the dashboard (login + (dashboard) route group with the sidebar)
src/components/          site components; admin/ for the dashboard; ui/ for shadcn primitives
src/content/             copy for the public pages, and the built-in catalog from the PDF
src/lib/                 db connection, auth, catalog loaders, pricing, zod schemas
src/models/              Mongoose models: Request, SpecialOffer, RelocationPackage
src/proxy.ts             keeps /admin behind the login
scripts/                 hash-password.ts
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```
