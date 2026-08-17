import { sqliteAdapter } from '@payloadcms/db-sqlite'
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
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  cors: [
    process.env.STOREFRONT_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter((value): value is string => Boolean(value)),
  csrf: [
    process.env.STOREFRONT_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter((value): value is string => Boolean(value)),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
