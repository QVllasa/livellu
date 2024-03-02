import {ArticleAttributes, Entity,} from '@/types';
import {useEffect, useState} from "react";
import Client from "@/framework/client";

export function useArticles(params?: any) {
    const [articles, setArticles] = useState<ArticleAttributes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        Client.articles.all(params)
            .then(response => {
                const data: ArticleAttributes[] = response.data.map((entity: Entity<ArticleAttributes>) => {
                    const id = entity.id;
                    const modifiedItem: ArticleAttributes = {
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

export function useArticle(params?: any) {
    const [article, setArticle] = useState<ArticleAttributes | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await getArticle(params);
                setArticle(data ?? null);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        })()

    }, []);

    return {article, loading, error};
}


export const getArticle = async (params: any) => {
    return Client.articles.get(params)
        .then(response => {
            const data: ArticleAttributes[] = response.data.map((entity: Entity<ArticleAttributes>) => {
                const id = entity.id;
                const modifiedItem: ArticleAttributes = {
                    ...entity.attributes,
                    id: id
                };
                return modifiedItem;
            });
            return data[0];
        })
}
