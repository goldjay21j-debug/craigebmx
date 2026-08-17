import type { CollectionConfig } from 'payload'

import { isAuthenticated } from '../access'

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const Bikes: CollectionConfig = {
  slug: 'bikes',
  labels: {
    singular: 'BMX bike',
    plural: 'BMX bikes',
  },
  admin: {
    group: 'Catalogue',
    useAsTitle: 'name',
    defaultColumns: ['name', 'year', 'brand', 'style', 'status', 'price', 'featured'],
    listSearchableFields: ['name', 'brand', 'slug'],
    description: 'Manage every bike shown in the Craig’s Bikes catalogue.',
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Bike details',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              hooks: {
                beforeValidate: [({ data, value }) => value || toSlug(data?.name)],
              },
              admin: {
                description: 'Used in the bike’s website URL. Leave blank to generate it from the name.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  required: true,
                  min: 1970,
                  max: 2035,
                  admin: { width: '25%' },
                },
                {
                  name: 'brand',
                  type: 'text',
                  required: true,
                  index: true,
                  admin: { width: '35%' },
                },
                {
                  name: 'style',
                  type: 'select',
                  required: true,
                  index: true,
                  options: ['Freestyle', 'Race', 'Flatland', 'Street'],
                  admin: { width: '40%' },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'highlights',
              type: 'array',
              labels: { singular: 'Highlight', plural: 'Highlights' },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Sales & availability',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'available',
                  index: true,
                  options: [
                    { label: 'Available', value: 'available' },
                    { label: 'Price on request', value: 'price-on-request' },
                    { label: 'Reserved', value: 'reserved' },
                    { label: 'Sold', value: 'sold' },
                    { label: 'Hidden draft', value: 'draft' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'price',
                  type: 'number',
                  min: 0,
                  admin: {
                    width: '50%',
                    step: 1,
                    description: 'Price in US dollars. Leave empty when using “Price on request”.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  index: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'featuredOrder',
                  type: 'number',
                  min: 1,
                  max: 6,
                  admin: {
                    width: '50%',
                    condition: (_, siblingData) => Boolean(siblingData?.featured),
                    description: 'Homepage position from 1 to 6.',
                  },
                },
              ],
            },
            {
              name: 'condition',
              type: 'select',
              defaultValue: 'collector-build',
              options: [
                { label: 'Original survivor', value: 'survivor' },
                { label: 'Restored', value: 'restored' },
                { label: 'New old stock', value: 'nos' },
                { label: 'Collector build', value: 'collector-build' },
                { label: 'Modern reissue', value: 'reissue' },
              ],
            },
          ],
        },
        {
          label: 'Photos',
          fields: [
            {
              name: 'primaryImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'gallery',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              required: true,
            },
          ],
        },
        {
          label: 'Source & archive',
          fields: [
            {
              name: 'legacyId',
              type: 'number',
              unique: true,
              index: true,
              admin: { readOnly: true },
            },
            {
              name: 'sourceLabel',
              type: 'text',
            },
            {
              name: 'sourceUrl',
              type: 'text',
              validate: (value: null | string | undefined) =>
                !value || /^https?:\/\//.test(value) || 'Enter a complete URL beginning with http:// or https://',
            },
          ],
        },
      ],
    },
  ],
}
