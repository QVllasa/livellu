import Client from "@/framework/client";


export async function fetchProducts(filters: any) {
    const params = {
        ...filters
    };

    const response = await Client.products.get(params);
    if (!response) {
        return {data: [], meta: {}}
    }
    return response;
}

