/**
 * Temporary deployment diagnostic. Reports connection reachability and the
 * real Payload initialisation error, with any credentials scrubbed.
 * Delete once the admin is confirmed working.
 */
import { getConnectionString } from '@netlify/database'

export const dynamic = 'force-dynamic'

/** Never let a connection string (which embeds a password) reach the response. */
const scrub = (text: string) =>
  text
    .replace(/postgres(ql)?:\/\/[^\s"']+/gi, '[connection-string-redacted]')
    .slice(0, 1500)

export async function GET() {
  let netlifyDb: string
  try {
    const value = getConnectionString()
    netlifyDb = value ? `present (scheme=${value.split(':')[0]}, length=${value.length})` : 'absent'
  } catch (error) {
    netlifyDb = `threw ${(error as Error).constructor.name}`
  }

  // Try a real Payload boot and surface whatever it actually complains about.
  let payloadInit = 'not attempted'
  try {
    const [{ getPayload }, config] = await Promise.all([
      import('payload'),
      import('@payload-config').then((m) => m.default),
    ])
    const payload = await getPayload({ config })
    const bikes = await payload.count({ collection: 'bikes', overrideAccess: true })
    payloadInit = `OK — bikes table reachable, ${bikes.totalDocs} rows`
  } catch (error) {
    const e = error as Error
    payloadInit = scrub(`${e.constructor.name}: ${e.message}\n--- stack ---\n${e.stack ?? ''}`)
  }

  return Response.json({
    nodeEnv: process.env.NODE_ENV ?? 'unset',
    netlifyGetConnectionString: netlifyDb,
    PAYLOAD_DB_PUSH: process.env.PAYLOAD_DB_PUSH ?? 'absent',
    payloadInit,
  })
}
