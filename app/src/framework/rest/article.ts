import {Article, Entity,} from '@/types';
import {useEffect, useState} from "react";
import Client from "@/framework/client";


export function useArticle(params?: any) {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            Client.articles.get(params)
                .then(response => {
                    const data: Article[] = response.data.map((entity: Entity<Article>) => {
                        const id = entity.id;
                        const modifiedItem: Article = {
                            ...entity.attributes,
                            id: id
                        };
                        return modifiedItem;
                    });
                    setArticle(data[0] ?? null);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err);
                    setLoading(false);
                });
        })();
    }, []);

    return {article, loading, error};
}


export function useArticles(params?: any) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        Client.articles.all(params)
            .then(response => {
                const data: Article[] = response.data.map((entity: Entity<Article>) => {
                    const id = entity.id;
                    const modifiedItem: Article = {
                        ...entity.attributes,
                        id: id
                    };
                    return modifiedItem;
                });
                setArticles(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return {articles, loading, error};
}
