// utils/fetchBrands.js
import Client from "@/framework/client";

export async function fetchBrands() {
    const params = {
        filters: {},
        populate: {
            child_brands: { populate: "*" },
            parent_brands: { populate: "*" },
        },
        pagination: {
            page: 1,
            pageSize: 1000,
        },
    };

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
