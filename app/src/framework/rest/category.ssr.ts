// utils/fetchCategorys.js
import Client from "@/framework/client";


export async function fetchCategoryBySlug(slug: string) {
    if (!slug) return Promise.resolve([]);
    const params = {
        filters: {
            slug: {
                $eq: slug
            }
        },
    };

    return await fetchCategories(params)
}

export async function fetchCategories(params: any) {

    const response = await Client.categories.all(params);
    const allCategories = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });

    return allCategories;
}

export async function fetchAllCategories() {
    const params = {
        filters: {
            // isCategory: {$eq: true}
        },
        populate: {
            child_categories: '*',
            parent_categories: '*',
        },
        pagination: {
            page: 1,
            pageSize: 1000,
        },
    };

    return fetchCategories(params);
}
