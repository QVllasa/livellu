// utils/fetchMaterials.js
import Client from "@/framework/client";

export async function fetchMaterials() {
    const params = {
        filters: {},
        populate: {
            child_materials: { populate: "*" },
            parent_materials: { populate: "*" },
        },
        pagination: {
            page: 1,
            pageSize: 1000,
        },
    };

    const response = await Client.materials.all(params);
    const allMaterials = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });

    return allMaterials;
}
