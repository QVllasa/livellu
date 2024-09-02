import {factories} from '@strapi/strapi';
import client from '../../../utils/meilisearch-client';

export default factories.createCoreController('api::navigation.navigation', ({ strapi }) => ({
  async get(ctx) {
    try {
      // Perform the search using Meilisearch
      const index = client.index('navigation'); // Ensure your Meilisearch index is named 'navigation'
      const searchResults = await index.search('', { limit: 1000 }); // Adjust the limit as needed

      const response = {
        data: searchResults.hits,
        meta: {
          hits: searchResults.hits.length,
          limit: searchResults.limit,
          offset: searchResults.offset,
          total: searchResults.totalHits,
          processingTimeMs: searchResults.processingTimeMs,
          query: searchResults.query,
        },
      };

      return ctx.send(response);
    } catch (error) {
      return ctx.throw(500, error.message);
    }
  },
}));
