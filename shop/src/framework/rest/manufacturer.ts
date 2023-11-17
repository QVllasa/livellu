import type {
  Manufacturer,
  ManufacturerPaginator,
  ManufacturerQueryOptions,
  QueryOptions,
} from '@/types';
import { useInfiniteQuery, useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from '@/framework/utils/data-mappers';
import { useRouter } from 'next/router';
import {MANUFACTURERS} from "@/db/manufacturers";

export function useManufacturers(options?: ManufacturerQueryOptions) {
  const { locale, query } = useRouter();

  let formattedOptions = {
    ...options,
    language: locale,
    name: query?.text,
  };

  // const {
  //   data,
  //   isLoading,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  // } = useInfiniteQuery<ManufacturerPaginator, Error>(
  //   [API_ENDPOINTS.MANUFACTURERS, formattedOptions],
  //   ({ queryKey, pageParam }) =>
  //     client.manufacturers.all(Object.assign({}, queryKey[1], pageParam)),
  //   {
  //     getNextPageParam: ({ current_page, last_page }) =>
  //       last_page > current_page && { page: current_page + 1 },
  //   }
  // );



  function handleLoadMore() {
    // fetchNextPage();
  }

  const data = JSON.parse(MANUFACTURERS)
  const isLoading = false;
  const error = false;
  const isFetching = false;
  const isFetchingNextPage = false;
  const hasNextPage = false;

  return {
    manufacturers: data?.pages?.flatMap((page: { data: any; }) => page.data) ?? [],
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

export function useTopManufacturers(options: Pick<QueryOptions, 'limit'>) {
  const { locale } = useRouter();

  let formattedOptions = {
    ...options,
    language: locale,
  };

  const { data, isLoading, error } = useQuery<Manufacturer[], Error>(
    [API_ENDPOINTS.MANUFACTURERS_TOP, formattedOptions],
    ({ queryKey }) => client.manufacturers.top(queryKey[1] as QueryOptions)
  );
  return {
    manufacturers: data ?? [],
    isLoading,
    error,
  };
}
