// utils/fetchBrands.js
import Client from "@/framework/client";
import {Brand} from "@/types";


export async function fetchAllBrands() {
    return fetchBrands({})
}

export async function fetchBrandBySlug(slug: string): Promise<Brand | null> {
    if (!slug) return Promise.resolve(null);
    const params = {slug: slug};
    return fetchBrand(params)
}

export async function fetchBrands(params: any) {
    // const response = await Client.brands.get(params);
    //sort brands by label albahetically
    // return response.data.sort((a: Brand, b: Brand) => a.label.localeCompare(b.label));
    return []
}

export async function fetchBrand(params: any) {
    const response = await Client.brands.get(params);
    return response.data[0];
}
