import * as React from "react";
import {Product} from "@/types";
import ProductCard from "@/components/products/cards/product-card";
import {XScrollable} from "@/components/ui/x-scrollable";

export const ProductSlider = ({products}: { products: Product[] }) => {

    if (!products.length) return null;

    return (
        <>
            <div className={'px-4'}>
                <XScrollable>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className={'relative scroll-ml-4 snap-center shrink-0 max-w-48 max-h-fit mx-1'}
                        >
                            <ProductCard product={product}/>
                        </div>
                    ))}
                </XScrollable>
            </div>

        </>
    );
};
