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
  categorySlug?: string;


  [key: string]: any;
}

export default factories.createCoreController('api::item.item', ({strapi}) => ({

  async post(ctx) {
    const {body} = ctx.request as { body: SearchRequestBody };

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
      categorySlug,
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


    const baseSearchParams: any = {
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

      // Step 1: Fetch the category embedding if categorySlug is provided
      let category = null;

      if (categorySlug) {
        const categories = await strapi.entityService.findMany('api::category.category', {
          filters: {slug: categorySlug},
          fields: ['embedding', 'name'],
        });

        console.log('Category:', category);

        if (!categories || !categories[0].embedding) {
          return ctx.badRequest("No embedding found for this category.");
        }
        category = categories[0];
      }

      let finalSearchParams = {
        ...baseSearchParams,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };



      // Step 2: Add the vector search if we have the category embedding
      if (category && category.embedding) {
        finalSearchParams = {
          ...finalSearchParams,
          hybrid: {
            "semanticRatio": 1,
            "embedder": "category"
          },
          vector: category.embedding["vector"],
        };
      }


      try {
        // Perform the search using Meilisearch with the final search parameters
        const searchResults = await index.search('', finalSearchParams);


        // Exclude unwanted facets from the facetDistribution
        const unwantedFacets = ['variants.price', 'variants.slug', 'variants.averageRating']; // Example unwanted facets
        const filteredFacetDistribution = Object.keys(searchResults.facetDistribution || {})
          .filter(key => !unwantedFacets.includes(key))
          .reduce((obj, key) => {
            obj[key] = searchResults.facetDistribution[key];
            return obj;
          }, {});

        console.log('Search query:', searchResults);

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
        console.error('Error:', error);
      }

    } catch (error) {
      return ctx.throw(500, error.message);
    }
  },

}));
