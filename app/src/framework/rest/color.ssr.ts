// utils/fetchColors.js
import Client from "@/framework/client";

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

export async function fetchColorBySlug(slug) {
    if (!slug) return Promise.resolve([]);
    const params = {
        filters: {
            slug: {
                $eq: slug,
            },
        },
    };

    return fetchColors(params);
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



export async function fetchColors(params) {

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
