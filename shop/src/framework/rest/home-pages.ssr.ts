import type {CategoryQueryOptions, HomePageProps, SettingsQueryOptions,} from '@/types';
import type {GetStaticPaths, GetStaticProps} from 'next';
import {QueryClient} from 'react-query';
import {dehydrate} from 'react-query/hydration';
import invariant from 'tiny-invariant';
import client from './client';
import {API_ENDPOINTS} from './client/api-endpoints';
import {CATEGORIES_PER_PAGE, PRODUCTS_PER_PAGE,} from './client/variables';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

type ParsedQueryParams = {
    pages: string[];
};

// This function gets called at build time
export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({
                                                                            locales,
                                                                        }) => {
    invariant(locales, 'locales is not defined');
    const data = await client.types.all({limit: 100});
    const paths = data?.flatMap((type) =>
        locales?.map((locale) => ({params: {pages: [type.slug]}, locale}))
    );
    // We'll pre-render only these paths at build time also with the slash route.
    return {
        paths: paths.concat(
            locales?.map((locale) => ({params: {pages: []}, locale}))
        ),
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps<
    HomePageProps,
    ParsedQueryParams
> = async ({locale, params}) => {
    const queryClient = new QueryClient();

    const types = [
        {
            id: 6,
            name: "Furniture",
            settings: {
                isHome: true,
                layoutType: "modern",
                productCard: "krypton"
            },
            slug: "furniture",
            language: "en",
            icon: "FurnitureIcon",
            promotional_sliders: [
                {
                    id: 902,
                    original: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/902/offer-5.png",
                    thumbnail: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/902/conversions/offer-5-thumbnail.jpg"
                },
                {
                    id: 903,
                    original: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/903/offer-4.png",
                    thumbnail: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/903/conversions/offer-4-thumbnail.jpg"
                },
                {
                    id: 904,
                    original: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/offer-3.png",
                    thumbnail: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/904/conversions/offer-3-thumbnail.jpg"
                },
                {
                    id: 905,
                    original: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/905/offer-2.png",
                    thumbnail: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/905/conversions/offer-2-thumbnail.jpg"
                },
                {
                    id: 906,
                    original: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/906/offer-1.png",
                    thumbnail: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/906/conversions/offer-1-thumbnail.jpg"
                }
            ],
            created_at: "2021-03-08T07:19:49.000000Z",
            updated_at: "2021-08-18T18:33:13.000000Z",
            translated_languages: [
                "en"
            ],
            banners: [
                {
                    id: 18,
                    type_id: 6,
                    title: "Exclusive furniture on cheap price",
                    description: "Make your house a home with our wide collection of beautiful furniture",
                    image: {
                        id: 922,
                        original: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/922/furniture-banner-1.jpg",
                        thumbnail: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/922/conversions/furniture-banner-1-thumbnail.jpg"
                    },
                    created_at: "2021-08-18T18:45:54.000000Z",
                    updated_at: "2021-08-18T18:45:54.000000Z"
                },
                {
                    id: 19,
                    type_id: 6,
                    title: "Furniter 2",
                    description: null,
                    image: {
                        id: 923,
                        original: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/923/furniture-banner-2.jpg",
                        thumbnail: "https://pickbazarlaravel.s3.ap-southeast-1.amazonaws.com/923/conversions/furniture-banner-2-thumbnail.jpg"
                    },
                    created_at: "2021-08-18T18:45:54.000000Z",
                    updated_at: "2021-08-18T18:45:54.000000Z"
                }
            ]
        }
    ]


    const pageType: string = types[0].slug;


    if (!types?.some((t) => t.slug === pageType)) {
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
            types.find((t) => t.slug === pageType)?.settings.layoutType === 'minimal'
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
              types.find((t) => t.slug === pageType)?.settings.layoutType ??
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
