import 'dotenv/config'
process.env.DATABASE_URL = (process.env.REMOTE_DATABASE_URL || '').replace(':5432/', ':6543/')
delete process.env.PAYLOAD_DB_PUSH
const t0 = Date.now()
const { getPayload } = await import('payload')
const config = await import('./src/payload.config.js').then((m) => m.default)
const payload = await getPayload({ config })
console.log(`init ${Date.now() - t0}ms`)
const t1 = Date.now()
const { docs } = await payload.find({ collection: 'bikes', limit: 2, depth: 1, overrideAccess: true })
console.log(`READ ok ${docs.length} bikes ${Date.now() - t1}ms`)
const t2 = Date.now()
const b = docs[0] as any
const up = (await payload.update({ collection: 'bikes', id: b.id, overrideAccess: true, data: { description: b.description } })) as any
console.log(`WRITE ok "${up.name}" ${Date.now() - t2}ms`)
process.exit(0)
