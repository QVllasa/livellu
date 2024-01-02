import {useEffect, useState} from 'react';
import Client from "@/framework/client";
import {Entity, NavigationItem} from "@/types";

const useNavigation = () => {
    const [navigationData, setNavigationData] = useState<NavigationItem[]> ([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        Client.navigation.all()
            .then(response => {
                const data: NavigationItem[] = response.data.map((entity: Entity<NavigationItem>) => {
                    const id = entity.id;
                    const modifiedItem: NavigationItem = {
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
