// path: src/api/item/controllers/item-search.ts
import {factories} from '@strapi/strapi';
import client from "../../../utils/meilisearch-client";

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
  minPrice?: number;  // Add minPrice
  maxPrice?: number;  // Add maxPrice
  [key: string]: any;
}

export default factories.createCoreController('api::item.item', ({strapi}) => ({

  async post(ctx) {
    const { body } = ctx.request as { body: SearchRequestBody };

    const {
      page = 1,
      pageSize = 48,
      searchTerms = '',
      filter = '',
      minPrice,  // Destructure minPrice from body
      maxPrice,  // Destructure maxPrice from body
      productId,
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

    const searchParams = {
      filter: filterConditions.length > 0 ? filterConditions.join(' AND ') : undefined,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      facets: [
        'brandName',
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
      attributesToHighlight: restParams.attributesToHighlight || undefined,
    };

    try {
      // Perform the search using Meilisearch
      const index = client.index('item');
      const searchResults = await index.search(searchTerms as string, searchParams);

      // Exclude unwanted facets from the facetDistribution
      const unwantedFacets = ['variants.price']; // Example unwanted facets
      const filteredFacetDistribution = Object.keys(searchResults.facetDistribution)
        .filter(key => !unwantedFacets.includes(key))
        .reduce((obj, key) => {
          obj[key] = searchResults.facetDistribution[key];
          return obj;
        }, {});

      const response = {
        data: searchResults.hits,
        meta: {
          page,
          pageSize,
          total: searchResults.estimatedTotalHits,
          totalPages: Math.ceil(searchResults.estimatedTotalHits / pageSize),
          processingTimeMs: searchResults.processingTimeMs,
          query: searchResults.query,
          facetDistribution: filteredFacetDistribution,  // Use the filtered facetDistribution
          facetStats: searchResults.facetStats,
        },
      };

      return ctx.send(response);
    } catch (error) {
      console.log('error: ', error);
      return ctx.throw(500, error.message);
    }
  },

}));
