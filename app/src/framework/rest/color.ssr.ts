// utils/fetchColors.js
import Client from "@/framework/client";

export async function fetchColors() {
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
