import { factories } from '@strapi/strapi';
import qs from 'qs';
import client from '../../../utils/meilisearch-client';

export default factories.createCoreController('api::brand.brand', ({ strapi }) => ({

  async get(ctx) {
    const { query } = ctx.request;
    const queryString = qs.stringify(query);
    const filters = qs.parse(queryString);

    // Construct the filter conditions
    const filterConditions: string[] = [];
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const value = filters[key];
        if (Array.isArray(value)) {
          filterConditions.push(`${key} IN [${value.map(val => `"${val}"`).join(', ')}]`);
        }  else {
          filterConditions.push(`${key} = "${value}"`);
        }
      }
    }

    const searchParams = {
      filter: filterConditions.join(' AND '),
      limit: 4000 // Fetch all brands
    };

    try {
      // Perform the search using Meilisearch
      const index = client.index('brand'); // Ensure your Meilisearch index is named 'brand'
      const searchResults = await index.search('', searchParams);

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
