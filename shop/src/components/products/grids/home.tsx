import {useProducts} from '@/framework/product';
import {PRODUCTS_PER_PAGE} from '@/framework/client/variables';
import {Grid} from '@/components/products/grid';
import {useRouter} from 'next/router';
import {PRODUCTS} from "@/db/products";

interface Props {
    className?: string;
    variables: any;
    column?: any;
    gridClassName?: string;
}

export default function ProductGridHome({
                                            className,
                                            variables,
                                            column,
                                            gridClassName,
                                        }: Props) {


    const {query} = useRouter();
    const {} =
        useProducts({
            ...variables,
            ...(query.category && { categories: query.category }),
            ...(query.text && { name: query.text }),
        });


    const productsItem: any = JSON.parse(PRODUCTS);
    return (
        <Grid
            products={productsItem}
            // loadMore={loadMore}
            // isLoading={isLoading}
            // isLoadingMore={isLoadingMore}
            // hasMore={hasMore}
            // error={error}
            limit={PRODUCTS_PER_PAGE}
            className={className}
            gridClassName={gridClassName}
            column={column}
        />
    );
}
