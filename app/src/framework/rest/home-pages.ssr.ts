import type {CategoryQueryOptions, HomePageProps, SettingsQueryOptions,} from '@/types';
import type {GetStaticPaths, GetStaticProps} from 'next';
import {QueryClient} from 'react-query';
import {dehydrate} from 'react-query/hydration';
import invariant from 'tiny-invariant';
import client from './client';
import {API_ENDPOINTS} from './client/api-endpoints';
import {CATEGORIES_PER_PAGE, PRODUCTS_PER_PAGE,} from './client/variables';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {TYPES} from "@/db/types";

type ParsedQueryParams = {
    pages: string[];
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
                                                                            locales,
                                                                        }) => {
    invariant(locales, 'locales is not defined');
    const data = JSON.parse(TYPES)
    const paths = data?.flatMap((type: { slug: any; }) =>
        locales?.map((locale) => ({params: {pages: [type.slug]}, locale}))
    );
    // We'll pre-render only these paths at build time also with the slash route.
    return {
        paths: paths.concat(
            locales?.map((locale) => ({params: {pages: []}, locale}))
        ),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<
    HomePageProps,
    ParsedQueryParams
> = async ({locale, params}) => {
    const queryClient = new QueryClient();

    const types = JSON.parse(TYPES)


    const { pages } = params!;
    let pageType: string | undefined;
    if (!pages) {
        pageType =
            types.find((type: { settings: { isHome: any; }; }) => type?.settings?.isHome)?.slug ?? types?.[0]?.slug;
    } else {
        pageType = pages[0];
    }


    if (!types?.some((t: { slug: string | undefined; }) => t.slug === pageType)) {
        return {
            notFound: true,
            // This is require to regenerate the page
            revalidate: 120,
        };
    }

    const productVariables = {
        type: pageType,
        limit: PRODUCTS_PER_PAGE,
    };


    const popularProductVariables = {
        type_slug: pageType,
        limit: 10,
        with: 'type;author',
        language: locale,
    };


    const categoryVariables = {
        type: pageType,
        limit: CATEGORIES_PER_PAGE,
        language: locale,
        parent:
            types.find((t: { slug: string | undefined; }) => t.slug === pageType)?.settings.layoutType === 'minimal'
                ? 'all'
                : 'null',
    };


    return {
        props: {
            variables: {
                popularProducts: popularProductVariables,
                products: productVariables,
                categories: categoryVariables,
                bestSellingProducts: popularProductVariables,
                types: {
                    type: pageType,
                    types: types,
                },
            },
            layout:
              types.find((t: { slug: string | undefined; }) => t.slug === pageType)?.settings.layoutType ??
              'default',
            ...(await serverSideTranslations(locale!, ['common', 'banner'])),
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
        revalidate: 120,
    };
};

/* Fix : locales: 14kB,
popularProducts: 30kB,
category: 22kB,
groups: 8kB,
group: 2kB,
settings: 2kB,
perProduct: 4.2 * 30 = 120kB,
total = 14 + 30 + 22 + 8 + 2 + 2 + 120 = 198kB
others: 225 - 198 = 27kB
 */
