export default {
  routes: [
    {
      method: 'GET',
      path: '/brands',
      handler: 'brand.get',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
