// path: src/api/item/controllers/item-search.ts
import {factories} from '@strapi/strapi';
import client from "../../../utils/meilisearch-client";

export const MatchingStrategies = {
  ALL: 'all',
  LAST: 'last',
  FREQUENCY: 'frequency',
} as const;

interface SearchRequestBody {
  page?: number;
  pageSize?: number;
  searchTerms?: string;
  filter?: string;
  facets?: string[];
  sort?: string[];
  attributesToRetrieve?: string[];
  attributesToCrop?: string[];
  attributesToHighlight?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  randomize?: boolean;
  [key: string]: any;
}

export default factories.createCoreController('api::item.item', ({ strapi }) => ({

  async post(ctx) {
    const { body } = ctx.request as { body: SearchRequestBody };

    const {
      page = 1,
      pageSize = 48,
      searchTerms = '',
      filter = '',
      minPrice,
      maxPrice,
      productId,
      minRating,
      randomize,
      ...restParams
    } = body;

    const filterConditions: string[] = [];

    if (filter) {
      filterConditions.push(filter);
    }

    // Add minPrice and maxPrice to filter conditions
    if (minPrice !== undefined) {
      filterConditions.push(`variants.price >= ${minPrice}`);
    }
    if (maxPrice !== undefined) {
      filterConditions.push(`variants.price <= ${maxPrice}`);
    }
    if (minRating !== undefined) {
      filterConditions.push(`variants.averageRating >= ${minRating}`);
    }

    const baseSearchParams = {
      filter: filterConditions.length > 0 ? filterConditions.join(' AND ') : undefined,
      facets: [
        'brandName',
        'variants.averageRating',
        'variants.style',
        'variants.height',
        'variants.width',
        'variants.depth',
        'variants.colors',
        'variants.materials',
        'variants.deliveryTimes',
        'variants.shape',
        'variants.price'  // Ensure 'variants.price' is included in facets
      ],
      sort: restParams.sort || undefined,
      attributesToRetrieve: restParams.attributesToRetrieve || undefined,
      attributesToCrop: restParams.attributesToCrop || undefined,
      attributesToHighlight: restParams.attributesToHighlight || undefined
    };

    try {
      const index = client.index('item');

      let finalSearchParams = {
        ...baseSearchParams,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };

      // If randomize is true, calculate a random offset
      if (randomize) {
        // Perform an initial search to get the total number of hits
        const initialSearchParams = {
          ...baseSearchParams,
          limit: 0, // We don't need any hits, just the total count
        };

        const initialSearchResults = await index.search(searchTerms as string, initialSearchParams);
        const totalHits = initialSearchResults.estimatedTotalHits;

        if (totalHits === 0) {
          // No results found
          return ctx.send({
            data: [],
            meta: {
              page,
              pageSize,
              total: 0,
              totalPages: 0,
              processingTimeMs: initialSearchResults.processingTimeMs,
              query: initialSearchResults.query,
              facetDistribution: {},
              facetStats: initialSearchResults.facetStats,
            },
          });
        }

        // Calculate a random offset
        const maxOffset = Math.max(0, totalHits - pageSize);
        const randomOffset = Math.floor(Math.random() * (maxOffset + 1));

        // Update the search parameters with the random offset
        finalSearchParams = {
          ...finalSearchParams,
          offset: randomOffset,
        };
      }

      // Perform the search using Meilisearch with the final search parameters
      const searchResults = await index.search(searchTerms as string, finalSearchParams);

      // Exclude unwanted facets from the facetDistribution
      const unwantedFacets = ['variants.price', 'variants.slug', 'variants.averageRating']; // Example unwanted facets
      const filteredFacetDistribution = Object.keys(searchResults.facetDistribution || {})
        .filter(key => !unwantedFacets.includes(key))
        .reduce((obj, key) => {
          obj[key] = searchResults.facetDistribution[key];
          return obj;
        }, {});

      const response = {
        data: searchResults.hits,
        meta: {
          page: randomize ? Math.floor(finalSearchParams.offset / pageSize) + 1 : page,
          pageSize,
          total: searchResults.estimatedTotalHits,
          totalPages: Math.ceil(searchResults.estimatedTotalHits / pageSize),
          processingTimeMs: searchResults.processingTimeMs,
          query: searchResults.query,
          facetDistribution: filteredFacetDistribution,
          facetStats: searchResults.facetStats,
        },
      };

      return ctx.send(response);
    } catch (error) {
      return ctx.throw(500, error.message);
    }
  },

}));
