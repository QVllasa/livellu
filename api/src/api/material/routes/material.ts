export default {
  routes: [
    {
      method: 'GET',
      path: '/materials',
      handler: 'material.get',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
