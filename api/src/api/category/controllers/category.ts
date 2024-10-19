// path: src/api/category/controllers/category-search.ts

import {factories} from '@strapi/strapi';
import qs from 'qs';
import client from '../../../utils/meilisearch-client';
import {Context} from 'koa';
import {SearchParams, SearchResponse} from 'meilisearch';

interface CustomSearchParams extends SearchParams {
  rankingScoreThreshold?: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  // Add other fields as necessary
}

interface CategorySearchFilters {
  [key: string]: string | string[] | undefined;
}

interface CategorySearchResponse {
  data: Category[];
  meta: {
    hits: number;
    limit: number;
    offset: number;
    total: number;
    processingTimeMs: number;
    query: string;
  };
}

export default factories.createCoreController('api::category.category', ({strapi}) => ({
  async get(ctx: Context) {
    const {query} = ctx.request;
    const queryString = qs.stringify(query);
    const filters = qs.parse(queryString) as CategorySearchFilters;

    const limit = filters.limit ? parseInt(filters.limit as string, 10) : 1000;

    // Extract the search string from the query parameters
    const searchString = (filters.search as string) || '';
    delete filters.search; // Remove 'search' from filters to avoid interfering with filter conditions
    delete filters.limit;

    // Construct the filter conditions
    const filterConditions: string[] = [];
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const value = filters[key];
        if (Array.isArray(value)) {
          filterConditions.push(`${key} IN [${value.map((val) => `"${val}"`).join(', ')}]`);
        } else if (value !== undefined) {
          filterConditions.push(`${key} = "${value}"`);
        }
      }
    }

    const searchParams: any = {
      filter: filterConditions.length > 0 ? filterConditions.join(' AND ') : undefined,
      limit:  limit, // Adjust as needed
      // rankingScoreThreshold: 0.5
      // Optionally, specify attributes to retrieve or other search parameters,
    };

    try {
      // Ensure that 'description' is set as a searchable attribute in your Meilisearch index settings
      const index = client.index('category');

      // Perform the search using Meilisearch
      const searchResults: SearchResponse<Category> = await index.search<Category>(searchString, searchParams);

      const response: CategorySearchResponse = {
        data: searchResults.hits,
        meta: {
          hits: searchResults.hits.length,
          limit: searchResults.limit,
          offset: searchResults.offset,
          total: searchResults.estimatedTotalHits,
          processingTimeMs: searchResults.processingTimeMs,
          query: searchResults.query,
        },
      };

      return ctx.send(response);
    } catch (error: any) {
      console.error('Error during category search:', error);
      return ctx.throw(500, error.message);
    }
  },
}));
