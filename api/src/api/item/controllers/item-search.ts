// path: src/api/item/controllers/item-search.ts
import { factories } from '@strapi/strapi';
import { MeiliSearch } from 'meilisearch';
import qs from 'qs';


const client = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: '7510VwYWCmVuVeZXzCj6bc49T6knJVk3TGiaSjZidS8',
});

export default factories.createCoreController('api::item.item', ({ strapi }) => ({
  async search(ctx) {
    const { query } = ctx.request;

    const { filters } = query;

    // Convert filters to Meilisearch filter format
    const filterConditions: string[] = [];

    if (filters) {
      // Assuming filters are passed in a URL-encoded format
      const filterObj = qs.parse(<any>filters);

      console.log(filterObj)

      for (const key in filterObj) {
        if (Object.prototype.hasOwnProperty.call(filterObj, key)) {
          const value = filterObj[key];
          if (Array.isArray(value)) {
            value.forEach((v) => {
              filterConditions.push(`${key} = "${v}"`);
            });
          } else if (typeof value === 'string' || typeof value === 'number') {
            filterConditions.push(`${key} = "${value}"`);
          }
        }
      }
    }


    const searchParams = {
      filter: filterConditions.join(' AND '),
      limit: 480
    };

    console.log(searchParams)

    try {
      // Perform the search using Meilisearch
      const index = client.index('item'); // Assuming your Meilisearch index is named 'items'

      const searchResults = await index.search('', searchParams);

      return ctx.send(searchResults);
    } catch (error) {
      return ctx.throw(500, error.message);
    }
  },
}));

