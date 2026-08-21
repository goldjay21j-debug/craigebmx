# Deploying the Craig's Bikes admin

The admin (`cms/`) is a **Payload CMS + Next.js server**. It cannot run on
Netlify: Netlify serves pre-built static files, while Payload needs a live Node
process, a writable database and persistent file storage.

Netlify keeps serving the public storefront at `www.craigesbike.com`.
The admin goes on its own host at `admin.craigesbike.com`.

```
www.craigesbike.com     →  Netlify   →  storefront (static export)
admin.craigesbike.com   →  Railway   →  cms/ (Payload + Postgres + S3)
```

## Why three things change at once

| Local (now) | Production | Reason |
|---|---|---|
| SQLite file | Postgres | Container disks are wiped on every deploy |
| `cms/media/` on disk | S3-compatible bucket | Same — uploads would vanish |
| Email to console | SMTP | Password resets must reach a real inbox |

The config auto-detects all three. Nothing is hardcoded: with no production env
vars set, it falls back to SQLite + local disk + console email, so local
development is unchanged.

## 1. Database

Create a Postgres instance (Railway/Render/Neon/Supabase all work) and set:

```
DATABASE_URL=postgres://user:pass@host:5432/dbname
```

The adapter is chosen by inspecting this value — a `postgres://` URL selects
Postgres, anything else stays on SQLite. No code edit needed.

## 2. Media storage

Any S3-compatible bucket. Cloudflare R2 is cheapest (no egress fees).

```
S3_BUCKET=craiges-bikes-media
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_REGION=auto
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

Omit `S3_ENDPOINT` for real AWS S3. If these are unset the CMS silently uses
local disk, which is correct for development and wrong for production.

## 3. Email (password resets)

```
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=...
EMAIL_FROM_ADDRESS=info@craigesbike.com
EMAIL_FROM_NAME=Craig's Bikes
```

Until this is set, "forgot password" writes the reset link to the server log
instead of sending it.

## 4. URLs

```
NEXT_PUBLIC_SERVER_URL=https://admin.craigesbike.com
STOREFRONT_URL=https://www.craigesbike.com
PAYLOAD_SECRET=<a NEW long random secret, not the development one>
```

`NEXT_PUBLIC_SERVER_URL` is the single switch that moves the admin off
localhost. `STOREFRONT_URL` is what allows the storefront's browser origin
through CORS.

## 5. DNS

Add a CNAME for `admin` pointing at the host, then add the custom domain in the
host's dashboard so it issues a TLS certificate.

## 6. Migrating existing content

The local SQLite database holds 35 bikes, 173 media files and one admin user.
Moving it to Postgres:

```bash
npm run migrate:export     # writes migration-export.json + copies media
npm run migrate:import     # replays into whatever DATABASE_URL points at
```

Run the import **once**, against the production database, with the S3 variables
set so the images upload to the bucket rather than local disk.

## 7. Deploy to Netlify (recommended — the domain already lives there)

Netlify can run Payload: it serves server-rendered Next.js through its Next.js
runtime. The storefront only looks static because it opts out with
`NETLIFY_NEXT_PLUGIN_SKIP` and `output: 'export'`.

The admin needs its **own Netlify site**, because one site cannot both publish a
static `out/` folder and server-render the admin:

| Site | Base directory | Mode |
|---|---|---|
| `craigesbikes` (existing) | repo root | static export |
| `craigesbikes-admin` (new) | `cms` | server-rendered |

`cms/netlify.toml` already sets the base directory and build command, and
deliberately does not set `NETLIFY_NEXT_PLUGIN_SKIP`.

1. Netlify → Add new site → Import from GitHub → `craigebmx`
2. **Base directory: `cms`** — it is picked up from `cms/netlify.toml`, but
   confirm it in the UI
3. Site configuration → Environment variables → add the contents of
   `railway-env.txt` (the name is historical; the variables are host-agnostic)
4. Add a Postgres database and set `DATABASE_URL` (Netlify DB, Neon or Supabase)
5. Add the S3 variables — Netlify functions are ephemeral, so uploads must go to
   a bucket or they vanish on redeploy
6. Domain management → add `admin.craigesbike.com`. DNS is already on Netlify
   for this domain, so no external CNAME is needed.

Limits worth knowing: uploads are capped near 4.5 MB per request (every current
media file is well under 300 KB), and functions have a 250 MB unzipped bundle
limit. Cold starts add a second or two to the first admin page load.

## 8. Deploy to Railway (alternative)

`railway.json` in this folder already sets the build and start commands. The
start command is `npx next start -p $PORT` rather than the `npm start` script,
because that script hardcodes port 3001 while Railway assigns a port at runtime.

1. New Project -> Deploy from GitHub -> pick this repo
2. Settings -> **Root Directory: `cms`** (without this it builds the storefront)
3. Add a **Postgres** service; `DATABASE_URL` is injected automatically
4. Variables -> Raw Editor -> paste the contents of `railway-env.txt`
5. Deploy, then watch the log for "Ready"
6. Settings -> Networking -> Custom Domain -> `admin.craigesbike.com`,
   then add the CNAME it shows you at your DNS provider

`railway-env.txt` is generated locally and gitignored because it contains the
production secret. Do not commit it.

Docker (`cms/Dockerfile`) also works; it requires `output: 'standalone'`, which
is set in `next.config.ts`.

## Security checklist before going live

- [ ] New `PAYLOAD_SECRET` (not the development value)
- [ ] Change the seeded admin password
- [ ] SMTP configured, so password reset works
- [ ] Confirm `admin.craigesbike.com` serves over HTTPS
