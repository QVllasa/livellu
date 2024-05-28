// utils/fetchPaths.js
import Client from "@/framework/client";


export async function fetchAllPaths() {
    return fetchPaths();
}


export async function fetchPaths(params = null) {

    const response = await Client.paths.all(params);

    const allPaths = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });

    return allPaths;
}
