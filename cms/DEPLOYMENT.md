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

## 7. Deploy

Railway: point it at this repo, set the **root directory** to `cms`, add all env
vars above, deploy. It detects Next.js automatically.

Docker (`cms/Dockerfile`) also works — it requires `output: 'standalone'`, which
is set in `next.config.ts`.

## Security checklist before going live

- [ ] New `PAYLOAD_SECRET` (not the development value)
- [ ] Change the seeded admin password
- [ ] SMTP configured, so password reset works
- [ ] Confirm `admin.craigesbike.com` serves over HTTPS
