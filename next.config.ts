import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // No `output: 'export'` here any more. The storefront used to be a static
  // export, which by definition cannot run a server -- and Payload's admin and
  // REST API only exist as server routes. Dropping it is what lets the shop and
  // the dashboard live in one app on one domain.
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
