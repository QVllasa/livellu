// utils/fetchColors.js
import Client from "@/framework/client";
import {Color} from "@/types";

export async function fetchColorSlugs() {
    const params = {
        filters: {
            isColor: {
                $eq: true,
            },
        },
        populate: {
            slug: "*",
        },
        pagination: {
            page: 1,
            pageSize: 1000,
        },
    };

    return fetchColors(params);
}

export async function fetchColorBySlug(slug: string):Promise<Color|null> {
    if (!slug) return Promise.resolve(null);
    const params = {
        filters: {
            slug: {
                $eq: slug,
            },
        },
    };

    return fetchColor(params);
}


export async function fetchAllColors() {
    const params = {
        filters: {
            isColor: {
                $eq: true,
            },
        },
        populate: {
            child_colors: { populate: "*" },
            parent_colors: { populate: "*" },
        },
        pagination: {
            page: 1,
            pageSize: 1000,
        },
    };

    return fetchColors(params);
}



export async function fetchColors(params: any) {

    const response = await Client.colors.all(params);
    const allColors = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });

    return allColors;
}


export async function fetchColor(params: any) {

    const response = await Client.colors.get(params);
    const color = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });

    return color[0];
}
