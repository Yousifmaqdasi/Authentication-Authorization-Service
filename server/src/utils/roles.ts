const roles = {
  admin: {
    can: ['create', 'edit', 'delete', 'view'],
  },
  editor: {
    can: ['create', 'edit', 'view'],
  },
  viewer: {
    can: ['view'],
  },
};