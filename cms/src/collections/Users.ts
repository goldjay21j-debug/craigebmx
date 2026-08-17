import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'System',
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60 * 8,
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: async ({ req }) => {
      if (req.user?.collection === 'users' && req.user.role === 'admin') return true
      const existingUsers = await req.payload.count({ collection: 'users' })
      return existingUsers.totalDocs === 0
    },
    read: ({ req }) => Boolean(req.user),
    update: ({ id, req }) =>
      req.user?.collection === 'users' &&
      (req.user.role === 'admin' || String(req.user.id) === String(id)),
    delete: ({ req }) => req.user?.collection === 'users' && req.user.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Catalogue editor', value: 'editor' },
      ],
      access: {
        update: ({ req }) => req.user?.collection === 'users' && req.user.role === 'admin',
      },
    },
  ],
}
