import {useEffect, useState} from "react";
import {Article, Category, Entity, Product} from "@/types";
import Client from "@/framework/client";

export function useCategories(params?: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    Client.categories.all(params)
        .then(response => {
          const data: Category[] = response.data.map((entity: Entity<Category>) => {
            const id = entity.id;
            const modifiedItem: Category = {
              ...entity.attributes,
              id: id
            };
            return modifiedItem;
          });
          setCategories(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
  }, []);

  return {categories, loading, error};
}


export function useCategory(params?: any) {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await fetchCategory(params);
                setCategory(data);
                setLoading(false);
            }catch (err: any) {
                setError(err);
                setLoading(false);
            }
        })();
    }, []);



    return {category, loading, error};
}


export const fetchCategory = async (params: any) => {
    return Client.categories.get(params)
        .then(response => {
            const data: Category[] = response.data.map((entity: Entity<Category>) => {
                const id = entity.id;
                const modifiedItem: Category = {
                    ...entity.attributes,
                    id: id
                };
                return modifiedItem;
            });
            return data[0] ?? null;
        });
}
