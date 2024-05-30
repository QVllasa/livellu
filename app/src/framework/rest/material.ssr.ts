// utils/fetchMaterials.js
import Client from "@/framework/client";
import {Material} from "@/types";

export async function fetchMaterialSlugs() {
    const params = {
        filters: {
            isMaterial: {
                $eq: true,
            },
            parent_materials: {id:  { $null: true }}

        },
        populate: {
            slug: "*",
        },
    };
    return fetchMaterials(params);

}

export async function fetchMaterialBySlug(slug: any): Promise<Material|null> {
    if (!slug) return Promise.resolve(null);
    const params = {
        filters: {
            slug: {
                $eq: slug,
            },
        },
    };
    return await fetchMaterial(params);
}


export async function fetchAllMaterials() {
    const params = {
        filters: {
            isMaterial: {
                $eq: true,
            },
            parent_materials: {id:  { $null: true }}

        },
        populate: {
            child_materials: {
                populate: {
                    child_materials: {
                        populate: "*",
                    },
                },
            },
        },
    };

    return fetchMaterials(params);
}


export async function fetchMaterials(params: any) {

    const response = await Client.materials.all(params);
    const allMaterials = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });

    return allMaterials;
}


export async function fetchMaterial(params: any) {

    const response = await Client.materials.get(params);
    const material = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });

    return material[0];
}
