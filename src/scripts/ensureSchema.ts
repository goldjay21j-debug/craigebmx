/**
 * Creates Payload's tables on the production database during the Netlify build.
 *
 * Payload performs schema push while initialising, but that cannot run inside
 * the bundled serverless function. The build machine has the full toolchain
 * (drizzle-kit ships with @payloadcms/db-postgres) and can reach the database,
 * so booting Payload once here creates the schema the function later queries.
 *
 * Requires PAYLOAD_DB_PUSH=true. Exits 0 even on failure so a database hiccup
 * does not block the deploy -- /health reports the true state either way.
 */
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config.js'

try {
  const payload = await getPayload({ config })

  // Touch every collection so each table is created and verified.
  for (const collection of ['bikes', 'media', 'orders', 'users'] as const) {
    const { totalDocs } = await payload.count({ collection, overrideAccess: true })
    process.stdout.write(`  ${collection}: ${totalDocs} rows\n`)
  }

  process.stdout.write('Schema ready.\n')
} catch (error) {
  const e = error as Error
  process.stdout.write(`\nSchema setup FAILED: ${e.constructor.name}: ${e.message}\n`)
  process.stdout.write('Deploy continues; check /health for the live state.\n')
}

process.exit(0)
