/**
 * Temporary deployment diagnostic. Reports only whether a database connection
 * is reachable and what scheme it uses — never the value itself. Delete once
 * the admin is confirmed working.
 *
 * Deliberately does not import payload.config: Payload is what fails, and
 * importing it would make this route fail the same way.
 */
import { getConnectionString } from '@netlify/database'

export const dynamic = 'force-dynamic'

const describe = (value: string | undefined) => {
  if (!value) return 'absent'
  return `present (scheme=${value.split(':')[0]}, length=${value.length})`
}

export function GET() {
  let netlifyDb: string
  try {
    const value = getConnectionString()
    netlifyDb = describe(value)
  } catch (error) {
    netlifyDb = `threw ${(error as Error).constructor.name}`
  }

  return Response.json({
    nodeEnv: process.env.NODE_ENV ?? 'unset',
    // The one that matters: Netlify Database is only reachable via this call.
    netlifyGetConnectionString: netlifyDb,
    DATABASE_URL: describe(process.env.DATABASE_URL),
    NETLIFY_DATABASE_URL: describe(process.env.NETLIFY_DATABASE_URL),
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ? 'present' : 'absent',
    PAYLOAD_DB_PUSH: process.env.PAYLOAD_DB_PUSH ?? 'absent',
    dbLikeKeys: Object.keys(process.env)
      .filter((k) => /DATABASE|POSTGRES|NEON/i.test(k))
      .sort(),
  })
}
