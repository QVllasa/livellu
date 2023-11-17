import type {
    BestSellingProductQueryOptions,
    PopularProductQueryOptions,
    Product,
    ProductPaginator,
    ProductQueryOptions,
} from '@/types';
import {useInfiniteQuery, useQuery,} from 'react-query';
import client from './client';
import {API_ENDPOINTS} from './client/api-endpoints';
import {mapPaginatorData} from '@/framework/utils/data-mappers';
import {formatProductsArgs} from '@/framework/utils/format-products-args';
import {useRouter} from 'next/router';
import {PRODUCTS} from "@/components/products/grids/products";

export function useProducts(options?: Partial<ProductQueryOptions>) {
    const {locale} = useRouter();

    const formattedOptions = {
        ...formatProductsArgs(options),
        language: locale,
    };

    // const {
    //     data,
    //     isLoading,
    //     error,
    //     fetchNextPage,
    //     hasNextPage,
    //     isFetching,
    //     isFetchingNextPage,
    // } = useInfiniteQuery<ProductPaginator, Error>(
    //     [API_ENDPOINTS.PRODUCTS, formattedOptions],
    //     ({queryKey, pageParam}) =>
    //         client.products.all(Object.assign({}, queryKey[1], pageParam)),
    //     {
    //         getNextPageParam: ({current_page, last_page}) =>
    //             last_page > current_page && {page: current_page + 1},
    //     }
    // );

    const data = JSON.parse(PRODUCTS)
    const isLoading = false;
    const error = null;
    const hasNextPage = false;
    const isFetching = false;
    const isFetchingNextPage = false;

    function handleLoadMore() {
        // fetchNextPage();
    }

    return {
        products: data?.pages?.flatMap((page) => page.data) ?? [],
        paginatorInfo: Array.isArray(data?.pages)
            ? mapPaginatorData(data?.pages[data.pages.length - 1])
            : null,
        isLoading,
        error,
        isFetching,
        isLoadingMore: isFetchingNextPage,
        loadMore: handleLoadMore,
        hasMore: Boolean(hasNextPage),
    };
}

export const usePopularProducts = (
    options?: Partial<PopularProductQueryOptions>
) => {
    const {locale} = useRouter();

    const formattedOptions = {
        ...options,
        language: locale,
    };

    const {data, isLoading, error} = useQuery<Product[], Error>(
        [API_ENDPOINTS.PRODUCTS_POPULAR, formattedOptions],
        ({queryKey}) =>
            client.products.popular(queryKey[1] as PopularProductQueryOptions)
    );

    return {
        products: data ?? [],
        isLoading,
        error,
    };
};

export const useBestSellingProducts = (
    options?: Partial<BestSellingProductQueryOptions>
) => {
    const {locale} = useRouter();

    const formattedOptions = {
        ...options,
        language: locale,
    };

    const {data, isLoading, error} = useQuery<Product[], Error>(
        [API_ENDPOINTS.BEST_SELLING_PRODUCTS, formattedOptions],
        ({queryKey}) =>
            client.products.bestSelling(queryKey[1] as BestSellingProductQueryOptions)
    );

    return {
        products: data ?? [],
        isLoading,
        error,
    };
};

export function useProduct({slug}: { slug: string }) {
    const {locale: language} = useRouter();

    // const { data, isLoading, error } = useQuery<Product, Error>(
    //   [API_ENDPOINTS.PRODUCTS, { slug, language }],
    //   () => client.products.get({ slug, language })
    // );

    const data = JSON.parse(PRODUCTS).find(p => p.slug === slug)
    const isLoading = false;
    const error = null;

    return {
        product: data,
        isLoading,
        error,
    };
}
