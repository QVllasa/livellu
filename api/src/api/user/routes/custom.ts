// /src/api/user/routes/custom.js

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/sync',
      handler: 'custom.sync',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
