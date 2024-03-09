import {useEffect, useState} from "react";
import {Product, Entity} from "@/types";
import Client from "@/framework/client";


export function useProducts(params?: any) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        Client.products.all(params)
            .then(response => {
                const data: Product[] = response.data.map((entity: Entity<Product>) => {
                    const id = entity.id;
                    const modifiedItem: Product = {
                        ...entity.attributes,
                        id: id
                    };
                    return modifiedItem;
                });
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return {products, loading, error};
}
