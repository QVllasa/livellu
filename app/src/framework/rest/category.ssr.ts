// utils/fetchCategorys.js
import Client from "@/framework/client";


export async function fetchCategories(params: any) {
    try {
        const response = await Client.categories.get(params);
        return response.data;

    } catch (error) {
        return []
    }
}

export async function fetchAllCategories() {
    const params = {level:0}
    return fetchCategories(params);
}

