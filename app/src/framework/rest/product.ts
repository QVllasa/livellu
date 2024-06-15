import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {Entity, Product} from "@/types";
import Client from "@/framework/client";
import {currentCategoryAtom} from "@/store/category";
import {currentBrandAtom, currentColorAtom, currentMaterialAtom} from "@/store/filters";

export function useProducts() {
    const [currentCategory] = useAtom(currentCategoryAtom);
    const [currentColor] = useAtom(currentColorAtom);
    const [currentMaterial] = useAtom(currentMaterialAtom);
    const [currentBrand] = useAtom(currentBrandAtom);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const productsFilter = {
        filters: {
            category: currentCategory?.name ? {$eq: currentCategory.name} : undefined,
            color: currentColor?.label ? {$eq: currentColor.label} : undefined,
            material: currentMaterial?.label ? {$eq: currentMaterial.label} : undefined,
            brandName: currentBrand?.label ? {$eq: currentBrand.label} : undefined,
        },
        pagination: {
            page: 1,
            pageSize: 10 // This sets the limit to 10 objects
        }
    };

    useEffect(() => {
        setLoading(true);
        Client.products.all(productsFilter)
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
    }, [currentCategory, currentColor, currentMaterial, currentBrand]);

    return {products, loading, error};
}


export async function fetchProducts(filters: any, pagination: any, sort: any) {
    const sorting = sort ? {sort: `${sort.dimension}:${sort.value}`} : {}
    const params = {
        filters: {
            ...filters,
            variants: {$notNull: true}
        },
        populate: '*',
        pagination: {
            page: 1,
            pageSize: 30, // Adjust the pageSize as needed
            ...pagination
        },
        // ...sorting, // Strapi sorting syntax
    };

    console.log("filter:  ", JSON.stringify(params));


    const response = await Client.products.all(params);
    const products = response.data.map((entity: Entity<Product>) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });

    return {products, ...response.meta.pagination};
}
