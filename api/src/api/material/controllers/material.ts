import { factories } from '@strapi/strapi';
import qs from 'qs';
import client from '../../../utils/meilisearch-client';

export default factories.createCoreController('api::material.material', ({ strapi }) => ({

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
      limit: 4000 // Fetch all materials
    };

    try {
      // Perform the search using Meilisearch
      const index = client.index('material'); // Ensure your Meilisearch index is named 'material'
      const searchResults = await index.search('', searchParams);

      const materials = searchResults.hits;

      // Create a map to store materials by their ID
      const materialsMap = new Map();

      // Populate the map
      materials.forEach(material => {
        if (!materialsMap.has(material.id)) {
          materialsMap.set(material.id, { ...material, child_materials: [] });
        }
      });

      // Link child materials to their parents
      materials.forEach(material => {
        material.parent_materials?.forEach(parent => {
          if (materialsMap.has(parent.id)) {
            materialsMap.get(parent.id).child_materials.push(materialsMap.get(material.id));
          }
        });
      });

      // Extract the hierarchical structure
      const hierarchicalMaterials = Array.from(materialsMap.values()).filter(material => {
        return !material.parent_materials?.some(parent => materialsMap.has(parent.id));
      });

      const response = {
        data: hierarchicalMaterials,
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
