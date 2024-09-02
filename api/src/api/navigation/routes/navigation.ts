export default {
  routes: [
    {
      method: 'GET',
      path: '/navigations',
      handler: 'navigation.get',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
