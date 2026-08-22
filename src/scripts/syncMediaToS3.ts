/**
 * Uploads every file in cms/media to the S3-compatible bucket, keyed by
 * filename -- which is exactly how @payloadcms/storage-s3 addresses them.
 *
 * The catalogue import ran before storage was configured, so Payload wrote the
 * image files to local disk and only their records to Postgres. The database is
 * therefore correct and untouched here; only the bytes are missing. This copies
 * originals and generated sizes (thumbnail, card) alike.
 *
 * Safe to re-run: existing keys are skipped unless they differ in size.
 *
 *   npm run media:sync
 */
import 'dotenv/config'

import fs from 'fs'
import path from 'path'
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const required = ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_ENDPOINT']
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  process.stderr.write(`Missing: ${missing.join(', ')}\n`)
  process.exit(1)
}

const Bucket = process.env.S3_BUCKET as string

const client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
})

const contentTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
}

const dir = path.resolve(process.cwd(), 'media')
const files = fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isFile())

process.stdout.write(`Syncing ${files.length} files to "${Bucket}"\n`)

let uploaded = 0
let skipped = 0
let failed = 0

for (const [index, filename] of files.entries()) {
  const full = path.join(dir, filename)
  const size = fs.statSync(full).size

  try {
    const head = await client.send(new HeadObjectCommand({ Bucket, Key: filename }))
    if (head.ContentLength === size) {
      skipped += 1
      continue
    }
  } catch {
    // Not present yet — fall through and upload.
  }

  try {
    await client.send(
      new PutObjectCommand({
        Bucket,
        Key: filename,
        Body: fs.createReadStream(full),
        ContentLength: size,
        ContentType: contentTypes[path.extname(filename).toLowerCase()] || 'application/octet-stream',
      }),
    )
    uploaded += 1
  } catch (error) {
    failed += 1
    process.stdout.write(`  ! ${filename}: ${(error as Error).message.slice(0, 80)}\n`)
  }

  if ((index + 1) % 50 === 0) {
    process.stdout.write(`  ${index + 1}/${files.length}\n`)
  }
}

process.stdout.write(`\nuploaded ${uploaded}, skipped ${skipped}, failed ${failed}\n`)
process.exit(failed ? 1 : 0)
