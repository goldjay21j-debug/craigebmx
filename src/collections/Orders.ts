import { randomUUID } from 'crypto'
import type { CollectionConfig } from 'payload'

import { isAuthenticated } from '../access'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    group: 'Sales',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'status', 'paymentStatus', 'total', 'createdAt'],
    listSearchableFields: ['orderNumber', 'customerName', 'email', 'phone'],
    description: 'Track enquiries, payments, packing and worldwide shipping.',
  },
  access: {
    create: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      defaultValue: () => `CB-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID().slice(0, 6).toUpperCase()}`,
      admin: { readOnly: true },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Customer',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'customerName', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'email', type: 'email', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', required: true, admin: { width: '50%' } },
                {
                  name: 'source',
                  type: 'select',
                  required: true,
                  defaultValue: 'whatsapp',
                  options: ['whatsapp', 'website', 'instagram', 'manual'],
                  admin: { width: '50%' },
                },
              ],
            },
            { name: 'shippingAddress', type: 'textarea' },
          ],
        },
        {
          label: 'Bikes & value',
          fields: [
            {
              name: 'items',
              type: 'array',
              required: true,
              minRows: 1,
              labels: { singular: 'Bike', plural: 'Bikes' },
              fields: [
                { name: 'bike', type: 'relationship', relationTo: 'bikes', required: true },
                { name: 'quantity', type: 'number', required: true, min: 1, defaultValue: 1 },
                { name: 'quotedPrice', type: 'number', min: 0 },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'subtotal', type: 'number', min: 0, admin: { width: '33%' } },
                { name: 'shippingCost', type: 'number', min: 0, admin: { width: '33%' } },
                { name: 'total', type: 'number', min: 0, admin: { width: '34%' } },
              ],
            },
          ],
        },
        {
          label: 'Fulfilment',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'new',
                  index: true,
                  options: [
                    { label: 'New enquiry', value: 'new' },
                    { label: 'Customer contacted', value: 'contacted' },
                    { label: 'Payment pending', value: 'payment-pending' },
                    { label: 'Paid', value: 'paid' },
                    { label: 'Packed', value: 'packed' },
                    { label: 'Shipped', value: 'shipped' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Cancelled', value: 'cancelled' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'paymentStatus',
                  type: 'select',
                  required: true,
                  defaultValue: 'unpaid',
                  options: ['unpaid', 'deposit-paid', 'paid', 'refunded'],
                  admin: { width: '50%' },
                },
              ],
            },
            { name: 'trackingNumber', type: 'text' },
            { name: 'notes', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
