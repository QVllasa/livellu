import {Entity, Merchant,} from '@/types';
import {useEffect, useState} from "react";
import Client from "@/framework/client";



export function useMerchants(params?: any) {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        Client.merchants.all(params)
            .then(response => {
                const data: Merchant[] = response.data.map((entity: Entity<Merchant>) => {
                    const id = entity.id;
                    const modifiedItem: Merchant = {
                        ...entity.attributes,
                        id: id
                    };
                    return modifiedItem;
                });
                setMerchants(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return {merchants, loading, error};
}

