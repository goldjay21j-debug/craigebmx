# Craig's Bikes Admin

Payload CMS dashboard for managing the Craig's Bikes catalogue, media, orders, users, and storefront settings.

## Local development

1. Copy `.env.example` to `.env` and set a strong `PAYLOAD_SECRET`.
2. Install dependencies with `npm install`.
3. Import the existing catalogue with `npm run seed`.
4. Start the dashboard with `npm run dev`.
5. Open `http://localhost:3001/admin` and create the first administrator account.

The local setup uses SQLite and stores uploaded images in `media/`. Both are intentionally ignored by Git.

## Commands

- `npm run dev` starts Payload on port 3001.
- `npm run seed` imports the 30-bike, 140-photo catalogue from the existing storefront.
- `npm run generate:types` refreshes Payload's TypeScript definitions.
- `npm run generate:importmap` refreshes the admin component import map.
- `npm run build` creates the production Next.js build.
- `npm start` serves the production build on port 3001.

## Production requirements

Do not use the local SQLite database or `media/` directory as the production data store on an ephemeral host. A production deployment should provide:

- a persistent database, preferably Postgres;
- durable object storage for uploaded images;
- a strong, private `PAYLOAD_SECRET`;
- the production `PAYLOAD_PUBLIC_SERVER_URL` and storefront origin;
- regular database and media backups.

The public storefront is a separate application. Publishing CMS changes to the shop requires wiring the storefront to Payload's API during the production integration step.
