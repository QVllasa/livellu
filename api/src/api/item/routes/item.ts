/**
 * item router
 */

// import { factories } from '@strapi/strapi';
//
// export default factories.createCoreRouter('api::item.item');


// path: src/api/item/routes/item.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/items/search',
      handler: 'item-search.search',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
