delete process.env.DATABASE_URL
process.env.PAYLOAD_SECRET = 'x'.repeat(32)
const cfg = await (await import('./src/payload.config.ts')).default
console.log('NO ENV -> db adapter:', (cfg as any).db?.name, '(did not crash)')
