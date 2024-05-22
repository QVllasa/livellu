export const findBrandBySlug = (brands, slug) => {
    for (const brand of brands) {
        if (brand.slug?.toLowerCase() === slug || brand.attributes?.slug?.toLowerCase() === slug) {
            return { id: brand.id, ...brand };
        }
    }
    return null;
};


// Helper function to find category by slug in the nested structure
export const findCategoryBySlug = (categories, slug) => {
    for (const category of categories) {
        if (category.slug?.toLowerCase() === slug || category.attributes?.slug?.toLowerCase() === slug) {
            return { id: category.id, ...category };
        }
        if (category.child_categories?.data?.length) {
            const found = findCategoryBySlug(category.child_categories.data, slug);
            if (found) {
                return { id: found.id, ...found.attributes };
            }
        }
    }
    return null;
};


// Helper function to find color by slug in the nested structure
export const findColorBySlug = (colors, slug) => {
    for (const color of colors) {
        if (color.slug?.toLowerCase() === slug || color.attributes?.slug?.toLowerCase() === slug) {
            return {id: color.id, ...color};
        }
    }
    return null;
};


// Helper function to find material by slug in the nested structure
export const findMaterialBySlug = (materials, slug) => {
    for (const material of materials) {
        if (material.slug?.toLowerCase() === slug || material.attributes?.slug?.toLowerCase() === slug) {
            return {id: material.id, ...material};
        }
    }
    return null;
};
