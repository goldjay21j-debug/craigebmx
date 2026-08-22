import type { CollectionConfig } from 'payload'

import { isAdministrator } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Catalogue',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    // A deleted image leaves every bike referencing it without a photo.
    delete: isAdministrator,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'sourcePath',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Original storefront path for imported catalogue photographs.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: 320,
        fit: 'cover',
      },
      {
        name: 'card',
        width: 720,
        height: 720,
        fit: 'inside',
      },
    ],
  },
}
