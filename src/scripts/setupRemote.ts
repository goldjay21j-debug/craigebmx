/**
 * Prepares a remote Postgres (Supabase, Neon, anything) from this machine:
 * creates Payload's schema, then loads the exported catalogue into it.
 *
 * Doing this locally sidesteps the problem that blocked every deploy so far --
 * Payload creates its tables while initialising, and that cannot run inside a
 * bundled serverless function. Here it runs in a full Node environment.
 *
 * Reads REMOTE_DATABASE_URL so the local DATABASE_URL (SQLite) is untouched.
 * Use Supabase's DIRECT connection (port 5432), not the transaction pooler --
 * table creation over a transaction-mode pooler is unreliable.
 *
 *   npm run db:setup-remote
 */
import 'dotenv/config'

const remote = process.env.REMOTE_DATABASE_URL

if (!remote) {
  process.stderr.write(
    'REMOTE_DATABASE_URL is not set.\n' +
      'Add it to cms/.env, for example:\n' +
      '  REMOTE_DATABASE_URL=postgresql://user:pass@host:5432/postgres\n',
  )
  process.exit(1)
}

if (!remote.startsWith('postgres://') && !remote.startsWith('postgresql://')) {
  process.stderr.write(`REMOTE_DATABASE_URL must be a postgres:// URL.\n`)
  process.exit(1)
}

// Point Payload at the remote database and allow it to create the schema.
process.env.DATABASE_URL = remote
process.env.PAYLOAD_DB_PUSH = 'true'

// Never print the URL itself; it embeds a password.
const host = remote.replace(/^postgres(ql)?:\/\/[^@]*@/, '').split('/')[0]
process.stdout.write(`Target: ${host}\n\nCreating schema...\n`)

const { getPayload } = await import('payload')
const config = await import('../payload.config.js').then((m) => m.default)

const payload = await getPayload({ config })

for (const collection of ['bikes', 'media', 'orders', 'users'] as const) {
  const { totalDocs } = await payload.count({ collection, overrideAccess: true })
  process.stdout.write(`  ${collection}: ${totalDocs} rows\n`)
}

process.stdout.write('\nSchema ready. Importing catalogue...\n\n')

// Runs its work on import, against the database configured above.
await import('./importContent.js')
