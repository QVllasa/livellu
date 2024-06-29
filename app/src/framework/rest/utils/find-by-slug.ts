import {Brand, Color, Material} from "@/types";

export const findBrandBySlug = (brands: Brand[], slug: string) => {
    for (const brand of brands) {
        if (brand.slug?.toLowerCase() === slug) {
            return brand;
        }
    }
    return null;
};


// Helper function to find color by slug in the nested structure
export const findColorBySlug = (colors: Color[], slug: string) => {
    for (const color of colors) {
        if (color.slug?.toLowerCase() === slug) {
            return color;
        }
    }
    return null;
};


export const findMaterialBySlug = (materials: Material[], slug: string): Material | null => {
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
    }
    return null;
};
