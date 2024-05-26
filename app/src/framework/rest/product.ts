import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {Entity, Product} from "@/types";
import Client from "@/framework/client";
import {currentCategoryAtom} from "@/store/category";
import {currentColorAtom} from "@/store/color";
import {currentMaterialAtom} from "@/store/material";
import {currentBrandAtom} from "@/store/brand";

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
        console.log("currentBrand:", currentBrand)
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


export async function fetchProducts(filters, pagination, sortBy = '', order = '') {
    const params = {
        filters: {
            ...filters,
        },
        pagination: {
            page: 1,
            pageSize: 30, // Adjust the pageSize as needed
            ...pagination
        },
        sort: `${sortBy}:${order}`, // Strapi sorting syntax
    };


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
