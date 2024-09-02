// utils/fetchCategorys.js
import Client from "@/framework/client";


export async function fetchNavigation(params: any) {
    try {
        const response = await Client.navigation.get(params);
        return response.data.sort((a: { order: number; }, b: { order: number; }) => a?.order - b?.order);

    } catch (error) {
        return []
    }
}


