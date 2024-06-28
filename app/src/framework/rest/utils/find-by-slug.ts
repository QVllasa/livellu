import _ from "lodash";

export const findBrandBySlug = (brands, slug) => {
    for (const brand of brands) {
        if (brand.slug?.toLowerCase() === slug || brand.attributes?.slug?.toLowerCase() === slug) {
            return { id: brand.id, ...brand };
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


export const findMaterialBySlug = (materials, slug) => {
    for (const material of materials) {
        if (material.slug?.toLowerCase() === slug) {
            return material;
        }
        if (material.child_materials?.length) {
            const found = findMaterialBySlug(material.child_materials, slug);
            if (found) {
                return found;
            }
        }
        if (material?.attributes?.child_materials?.length) {
            const found = findMaterialBySlug(material.attributes.child_materials, slug);
            if (found) {
                return found;
            }
        }
    }
    return null;
};
