// utils/fetchCategorys.js
import Client from "@/framework/client";

export async function fetchCategories() {
    const params = {
        filters: {},
        populate: {
            child_categories: { populate: "*" },
            parent_categories: { populate: "*" },
        },
        pagination: {
            page: 1,
            pageSize: 1000,
        },
    };

    const response = await Client.categories.all(params);
    const allCategorys = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });

    return allCategorys;
}
