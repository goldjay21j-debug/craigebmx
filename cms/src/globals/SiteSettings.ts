import type { GlobalConfig } from 'payload'

import { isAuthenticated } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Store settings',
  admin: {
    group: 'Storefront',
    description: 'Contact details and storefront messages used by Craig’s Bikes.',
  },
  access: {
    read: () => true,
    update: isAuthenticated,
  },
  fields: [
    { name: 'storeName', type: 'text', required: true, defaultValue: "Craig's Bikes" },
    {
      type: 'row',
      fields: [
        { name: 'whatsappNumber', type: 'text', required: true, defaultValue: '16089573848', admin: { width: '50%' } },
        { name: 'currency', type: 'select', required: true, defaultValue: 'USD', options: ['USD', 'EUR', 'GBP'], admin: { width: '50%' } },
      ],
    },
    { name: 'contactEmail', type: 'email' },
    { name: 'announcement', type: 'text', defaultValue: 'Worldwide shipping available on collector BMX bikes.' },
    { name: 'shippingNote', type: 'textarea', defaultValue: 'Shipping quotes are confirmed through WhatsApp before payment.' },
    {
      name: 'homepageFeatured',
      type: 'relationship',
      relationTo: 'bikes',
      hasMany: true,
      maxRows: 6,
      admin: { description: 'Choose up to six bikes for the homepage.' },
    },
  ],
}
