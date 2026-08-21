/**
 * Temporary deployment diagnostic. Reports only whether variables are present
 * and what URL scheme they use — never their values. Delete once the admin is
 * confirmed working.
 *
 * Deliberately does not import payload.config: Payload is what is failing, and
 * importing it would make this route fail the same way.
 */
export const dynamic = 'force-dynamic'

const describe = (value: string | undefined) => {
  if (!value) return 'absent'
  const scheme = value.split(':')[0]
  return `present (scheme=${scheme}, length=${value.length})`
}

export function GET() {
  return Response.json({
    nodeEnv: process.env.NODE_ENV ?? 'unset',
    DATABASE_URL: describe(process.env.DATABASE_URL),
    NETLIFY_DATABASE_URL: describe(process.env.NETLIFY_DATABASE_URL),
    NETLIFY_DATABASE_URL_UNPOOLED: describe(process.env.NETLIFY_DATABASE_URL_UNPOOLED),
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ? 'present' : 'absent',
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'absent',
    // Which database-ish variables exist at all, by name only.
    dbLikeKeys: Object.keys(process.env)
      .filter((k) => /DATABASE|POSTGRES|NEON/i.test(k))
      .sort(),
  })
}
