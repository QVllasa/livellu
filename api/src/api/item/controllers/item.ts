// path: src/api/item/controllers/item-search.ts
import {factories} from '@strapi/strapi';
import {MeiliSearch} from 'meilisearch';
import qs from 'qs';
// import client from "../../../utils/meilisearch-client";

const client = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'd4de84ae2d98e4fca9be480e3996743c4553b82c78f71bf7d7bfa0ce8c3f3efb',
});

export default factories.createCoreController('api::item.item', ({strapi}) => ({

  async get(ctx) {

    const {query} = ctx.request;
    const queryString = qs.stringify(query);
    const filters = qs.parse(queryString);
    const {
      page = '1',
      pageSize = '48',
      searchTerms = '',
      sort,
      minPrice,
      maxPrice} = filters;

    console.log('sort: ', sort)

    // Convert filters to Meilisearch filter format
    const filterConditions: string[] = [];

    // Iterate over the filters and construct the filter conditions
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)
        && key !== 'page'
        && key !== 'pageSize'
        && key !== 'minPrice'
        && key !== 'maxPrice'
        && key !== 'searchTerms'
        && key !== 'sort'
        && key !== 'variants.averageRating'
        && key !== 'variants.originalColor'
      ) {
        const value = filters[key];
        if (Array.isArray(value)) {
          value.forEach((v) => {
            filterConditions.push(`${key} = "${v}"`);
          });
        } else if (typeof value === 'string' || typeof value === 'number') {
          filterConditions.push(`${key} = "${value}"`);
        }
      }
    }

    if (filters['variants.originalColor']) {
      filterConditions.push(`variants.originalColor IN [${Object.values(filters['variants.originalColor'])}]`);
    }


    // Add minPrice and maxPrice to filter conditions
    if (minPrice) {
      filterConditions.push(`variants.price >= ${minPrice}`);
    }
    if (maxPrice) {
      filterConditions.push(`variants.price <= ${maxPrice}`);
    }

    if (filters['variants.averageRating']) {
      filterConditions.push(`variants.averageRating >= ${filters['variants.averageRating']}`);
    }


    const searchParams = {
      filter: filterConditions.length > 0 ? filterConditions.join(' AND ') : undefined,
      limit: parseInt(pageSize as string, 10),
      offset: (parseInt(page as string, 10) - 1) * parseInt(pageSize as string, 10),
      hitsPerPage: parseInt(pageSize as string, 10),
      // sort: ['variants.averageRating:asc'],
    };

    try {
      // Perform the search using Meilisearch
      const index = client.index('item'); // Ensure your Meilisearch index is named 'items'
      const searchResults = await index.search(<string>searchTerms, searchParams);

      const response = {
        data: searchResults.hits,
        meta: {
          page: searchResults.page,
          hitsPerPage: pageSize,
          pageSize: searchResults.hitsPerPage,
          limit: searchResults.limit,
          offset: searchResults.offset,
          total: searchResults.totalHits,
          totalPages: searchResults.totalPages,
          processingTimeMs: searchResults.processingTimeMs,
          query: searchResults.query,
          // Add any additional meta information you need here
        },
      };


      return ctx.send(response);
    } catch (error) {
      console.log('error: ', error)
      return ctx.throw(500, error.message);
    }
  },

  async getMinMaxPrice(ctx) {
    try {
      const index = client.index('item');
      const {facetStats} = await index.search('', {facets: ['variants.price']});
      const {min, max} = facetStats['variants.price'];
      return ctx.send({min, max});
    } catch (error) {
      return ctx.throw(500, error.message);
    }
  }
}));
