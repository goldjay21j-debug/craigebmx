import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Bikes } from './collections/Bikes'
import { Orders } from './collections/Orders'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Public address this CMS is served from. Set NEXT_PUBLIC_SERVER_URL in the
// hosting environment (e.g. https://admin.craigesbike.com); falls back to the
// local dev server so localhost keeps working untouched.
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'

// Public address of the storefront that reads from this CMS.
const storefrontURL = process.env.STOREFRONT_URL || 'http://localhost:3000'

// Browser origins allowed to call the API. Always includes the local dev
// servers so development is never blocked by production values.
const allowedOrigins = Array.from(
  new Set(
    [serverURL, storefrontURL, 'http://localhost:3000', 'http://localhost:3001'].filter(
      (value): value is string => Boolean(value),
    ),
  ),
)

// --- Database -------------------------------------------------------------
// A postgres:// URL selects Postgres (production); anything else keeps the
// local SQLite file, so development is unaffected by production settings.
const databaseURL = process.env.DATABASE_URL || ''
const usePostgres =
  databaseURL.startsWith('postgres://') || databaseURL.startsWith('postgresql://')

const db = usePostgres
  ? postgresAdapter({ pool: { connectionString: databaseURL } })
  : sqliteAdapter({ client: { url: databaseURL } })

// --- Media storage --------------------------------------------------------
// Container filesystems are wiped on redeploy, so production must offload
// uploads to an S3-compatible bucket. Falls back to local disk when unset.
const s3Configured = Boolean(
  process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
)

const plugins = s3Configured
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET as string,
        config: {
          region: process.env.S3_REGION || 'auto',
          // Required for R2 / Spaces / MinIO; omit for genuine AWS S3.
          ...(process.env.S3_ENDPOINT
            ? { endpoint: process.env.S3_ENDPOINT, forcePathStyle: true }
            : {}),
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
          },
        },
      }),
    ]
  : []

// --- Email ----------------------------------------------------------------
// Without SMTP, Payload writes password-reset links to the server console,
// which is fine locally but means nobody can recover an account in production.
const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)

const email = smtpConfigured
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'info@craigesbike.com',
      defaultFromName: process.env.EMAIL_FROM_NAME || "Craig's Bikes",
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    })
  : undefined

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'dark',
    dateFormat: 'dd MMM yyyy, HH:mm',
    timezones: {
      defaultTimezone: 'Africa/Douala',
      supportedTimezones: [
        { label: 'Douala / West Africa', value: 'Africa/Douala' },
        { label: 'London', value: 'Europe/London' },
        { label: 'New York', value: 'America/New_York' },
        { label: 'Los Angeles', value: 'America/Los_Angeles' },
      ],
    },
    meta: {
      titleSuffix: " — Craig's Bikes Admin",
      icons: [{ rel: 'icon', type: 'image/png', url: '/craigs-bikes-icon.png' }],
    },
    components: {
      beforeDashboard: ['./components/WelcomePanel'],
      graphics: {
        Logo: './components/BrandLogo#BrandLogo',
        Icon: './components/BrandLogo#BrandIcon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Bikes, Media, Orders, Users],
  globals: [SiteSettings],
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  email,
  sharp,
  plugins,
})
