// utils/fetchColors.js
import Client from "@/framework/client";
import {Color} from "@/types";


export async function fetchColorBySlug(slug: string):Promise<Color|null> {
    const params = {slug: slug};
    return fetchColors(params);
}

export async function fetchAllColors() {
    const params = { isColor:  true};
    return fetchColors(params);
}

export async function fetchColors(params: any) {
    const response = await Client.colors.get(params);
    return response.data;
}
