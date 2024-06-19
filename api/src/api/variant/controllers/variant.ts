// path: src/api/item/controllers/item-search.ts
import { factories } from '@strapi/strapi';
import { MeiliSearch } from 'meilisearch';
import qs from 'qs';


const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY || '',
});

export default factories.createCoreController('api::variant.variant', ({ strapi }) => ({
  async search(ctx) {
    const { query } = ctx.request;
    const searchTerm: string | any = query.search || '';

    // Perform the search using Meilisearch
    const index = client.index('variant'); // Assuming your Meilisearch index is named 'items'
    const searchResults = await index.search(searchTerm, {
      limit: 48
    });

    ctx.send(searchResults.hits);
  },
}));

