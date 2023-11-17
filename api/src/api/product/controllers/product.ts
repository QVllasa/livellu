/**
 * product controller
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreController('api::product.product')
  // ({strapi}) =>
  // ({
  //   // Method 1: Creating an entirely custom action
  //   async createMany(ctx) {
  //     try {
  //       ctx.body = 'ok';
  //     } catch (err) {
  //       ctx.body = err;
  //     }
  //   },
  // }))



