import 'dotenv/config'
// Point Payload at the TRANSACTION pooler
process.env.DATABASE_URL = (process.env.REMOTE_DATABASE_URL || '').replace(':5432/', ':6543/')
delete process.env.PAYLOAD_DB_PUSH  // schema already exists; never push through a txn pooler

const { getPayload } = await import('payload')
const config = await import('./src/payload.config.js').then((m) => m.default)
const payload = await getPayload({ config })

const t0 = Date.now()
const { docs } = await payload.find({ collection: 'bikes', limit: 2, depth: 1, overrideAccess: true })
console.log(`READ  ok ${docs.length} bikes with media, ${Date.now() - t0}ms`)

const t1 = Date.now()
const b = docs[0] as any
const up = await payload.update({ collection: 'bikes', id: b.id, overrideAccess: true, data: { description: b.description } }) as any
console.log(`WRITE ok "${up.name}", ${Date.now() - t1}ms`)

const t2 = Date.now()
const m = await payload.count({ collection: 'media', overrideAccess: true })
console.log(`COUNT ok ${m.totalDocs} media, ${Date.now() - t2}ms`)
process.exit(0)
