// utils/fetchCategorys.js
import Client from "@/framework/client";

export async function fetchCategories() {
    const params = {
        filters: {
            isCategory: {$eq: true}
        },
        populate: {
            child_categories: {
                populate: "*",
                // filters: {
                //     isCategory: {$eq: true}
                // },
                // populate: {
                //     child_categories: {
                //         filters: {
                //             isCategory: {$eq: true}
                //         },
                //         populate: "*"
                //     },
                // }
            },
            parent_categories: {populate: "*"},
        },
        pagination: {
            page: 1,
            pageSize: 1000,
        },
    };

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
