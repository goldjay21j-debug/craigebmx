/**
 * Temporary deployment diagnostic. Reports whether the database is reachable
 * and, when Payload fails to boot, the real error with credentials scrubbed.
 * Delete once the admin is confirmed working.
 */
export const dynamic = 'force-dynamic'

/** Never let a connection string (which embeds a password) reach the response. */
const scrub = (text: string) =>
  text.replace(/postgres(ql)?:\/\/[^\s"']+/gi, '[connection-string-redacted]').slice(0, 1200)

const describe = (value: string | undefined) =>
  value ? `present (scheme=${value.split(':')[0]}, length=${value.length})` : 'absent'

export async function GET() {
  let payloadInit = 'not attempted'
  try {
    const [{ getPayload }, config] = await Promise.all([
      import('payload'),
      import('@payload-config').then((m) => m.default),
    ])
    const payload = await getPayload({ config })
    const bikes = await payload.count({ collection: 'bikes', overrideAccess: true })
    payloadInit = `OK — ${bikes.totalDocs} bikes`
  } catch (error) {
    const e = error as Error
    payloadInit = scrub(`${e.constructor.name}: ${e.message}`)
  }

  return Response.json({
    nodeEnv: process.env.NODE_ENV ?? 'unset',
    DATABASE_URL: describe(process.env.DATABASE_URL),
    POSTGRES_URL: describe(process.env.POSTGRES_URL),
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ? 'present' : 'absent',
    PAYLOAD_DB_PUSH: process.env.PAYLOAD_DB_PUSH ?? 'absent',
    payloadInit,
  })
}
