// utils/fetchCategorys.js
import Client from "@/framework/client";
import {Category} from "@/types";


export async function fetchCategories(params: any) {
    const response = await Client.categories.get(params);
    return response.data;
}

export async function fetchAllCategories() {
    const params = {level:0}
    return fetchCategories(params);
}

