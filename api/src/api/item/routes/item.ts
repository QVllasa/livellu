/**
 * item router
 */

// import { factories } from '@strapi/strapi';
//
// export default factories.createCoreRouter('api::item.item');


// path: src/api/item/routes/items.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/items',
      handler: 'item.get',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/items',
      handler: 'item.post',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/items/min-max-price',
      handler: 'item.getMinMaxPrice',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
