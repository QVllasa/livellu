// utils/fetchMaterials.js
import Client from "@/framework/client";
import {Material} from "@/types";

export async function fetchMaterialBySlug(slug: any): Promise<Material | null> {
    if (!slug) return Promise.resolve(null);
    const params = {slug: slug};
    return await fetchMaterial(params);
}


export async function fetchAllMaterials() {
    const params = {isMaterial: true};
    return fetchMaterials(params);
}


export async function fetchMaterials(params: any) {
    const response = await Client.materials.get(params);
    return response.data;
}


export async function fetchMaterial(params: any) {
    const response = await Client.materials.get(params);
    return response.data[0];
}
