import type { Access } from 'payload'

export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

export const isAdministrator: Access = ({ req }) =>
  req.user?.collection === 'users' && req.user.role === 'admin'
