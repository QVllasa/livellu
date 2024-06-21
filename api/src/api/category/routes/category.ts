/**
 * category router
 */

// import { factories } from '@strapi/strapi';
//
// export default factories.createCoreRouter('api::category.category');


export default {
  routes: [
    {
      method: 'GET',
      path: '/categories',
      handler: 'category.get',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
