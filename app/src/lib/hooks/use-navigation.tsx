import {useEffect, useState} from 'react';
import Client from "@/framework/client";
import {Entity, Navigation} from "@/types";

const useNavigation = (params: any) => {
    const [navigationData, setNavigationData] = useState<Navigation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        Client.navigation.all(params)
            .then(response => {
                const data: Navigation[] = response.data.map((entity: Entity<Navigation>) => {
                    const id = entity.id;
                    const modifiedItem: Navigation = {
                        ...entity.attributes,
                        id: id
                    };
                    return modifiedItem;
                });
                setNavigationData(data.sort((a, b) => a.order - b.order));
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return {navigationData, loading, error};
};

export default useNavigation;
