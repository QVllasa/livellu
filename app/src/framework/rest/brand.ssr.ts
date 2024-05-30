// utils/fetchBrands.js
import Client from "@/framework/client";
import {Brand} from "@/types";

export async function fetchBrandSlugs() {
    const params = {
        filters: {},
        populate: {
            slug: "*",
        },
        pagination: {
            page: 1,
            pageSize: 1000,
        },
    };
    return fetchBrands(params)
}

export async function fetchAllBrands() {
    const params = {
        filters: {},
        populate: {
            child_brands: {populate: "*"},
            parent_brands: {populate: "*"},
        },
        pagination: {
            page: 1,
            pageSize: 10,
        },
    };
    return fetchBrands(params)
}

export async function fetchBrandBySlug(slug: string): Promise<Brand | null> {
    if (!slug) return Promise.resolve(null);
    const params = {
        filters: {
            slug: {
                $eq: slug
            }
        },
    };
    return fetchBrand(params)
}

export async function fetchBrands(params: any) {


    const response = await Client.brands.all(params);
    const allBrands = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });
    return allBrands;
}

export async function fetchBrand(params: any) {

    const response = await Client.brands.get(params);
    const brand = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });

    return brand[0];
}
