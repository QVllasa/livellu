import Client from "@/framework/client";


export async function fetchProducts(filters: any) {
    const params = {
        ...filters
    };
    try {
        const response = await Client.products.get(params);
        if (!response) {
            return {data: [], meta: {}}
        }
        return response;
    } catch (error) {
        return {data: [], meta: {}}
    }
}

