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
      path: '/colors',
      handler: 'color.get',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
