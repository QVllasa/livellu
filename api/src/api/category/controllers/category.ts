import {factories} from '@strapi/strapi';
import qs from 'qs';
import client from '../../../utils/meilisearch-client';

export default factories.createCoreController('api::category.category', ({ strapi }) => ({

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
        } else {
          filterConditions.push(`${key} = "${value}"`);
        }
      }
    }

    const searchParams = {
      filter: filterConditions.join(' AND '),
      limit: 1000, // Fetch all categories
    };

    try {
      // Perform the search using Meilisearch
      const index = client.index('category'); // Ensure your Meilisearch index is named 'category'
      const searchResults = await index.search('', searchParams);

      // Fetch categories with nested children
      const categoriesWithChildren = await Promise.all(
        searchResults.hits.map(async (category) => {
          const categoryWithChildren = await fetchCategoryWithChildren(category.slug);
          return categoryWithChildren;
        })
      );

      const response = {
        data: categoriesWithChildren,
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

// Helper function to fetch category with nested children using Meilisearch
async function fetchCategoryWithChildren(slug) {
  const index = client.index('category');

  // Fetch the category
  const categoryResult = await index.search('', {
    filter: `slug = "${slug}"`,
    limit: 1,
  });

  if (categoryResult.hits.length === 0) {
    throw new Error(`Category with slug ${slug} not found`);
  }

  const category = categoryResult.hits[0];

  // Fetch the child categories
  const childCategoriesResult = await index.search('', {
    filter: `parent_categories.slug = "${slug}"`,
    limit: 1000,
  });

  if (childCategoriesResult.hits.length > 0) {
    category.child_categories = await Promise.all(
      childCategoriesResult.hits.map(async (child) => {
        const childWithChildren = await fetchCategoryWithChildren(child.slug);
        return childWithChildren;
      })
    );
  } else {
    category.child_categories = [];
  }

  return category;
}
