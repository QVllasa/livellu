import {JSXElementConstructor, ReactElement, useState} from "react";
import {fetchProducts} from "@/framework/product";
import {Category, Entity, Merchant, MetaData, NextPageWithLayout, Product} from "@/types";
import {GetServerSidePropsContext} from "next";
import {ProductsGrid} from "@/components/products/products-grid";
import {getShopResultsLayout} from "@/components/layouts/shops-results-layout";
import Client from "@/framework/client";

interface SearchPageProps {
    initialProducts: Product[];
    page: number;
    meta: MetaData;
    initialCategory: Category | null;
    filters: any;
}

const ShopPage: NextPageWithLayout<typeof getServerSideProps> = (props: SearchPageProps) => {
    const {initialProducts, page, meta, initialCategory, filters} = props;
    const [loading, setLoading] = useState(false);

    return (
        <>
            <ProductsGrid initialFilters={filters} initialProducts={initialProducts} initialPage={meta?.page} pageCount={meta?.totalPages ?? 0} initialLoading={loading}/>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const {params, query} = context;
    const filters: any = {};

    const {shop} = query;

    const filter = {
        populate: 'logo_image',
        filters: {
            slug: {
                $eq: shop,
            },
        },
    }

    const merchant = await Client.merchants.all(filter)
        .then(response => {
            const data: Merchant[] = response.data.map((entity: Entity<Merchant>) => {
                const id = entity.id;
                const modifiedItem: Merchant = {
                    ...entity.attributes,
                    id: id
                };
                return modifiedItem;
            });
            return data[0];
        }).catch(error => {
            console.error("Error fetching merchant: ", error);
            return null;
        })

    if (!merchant) {
        return {
            notFound: true,
        };
    }


    const page = parseInt((query.page as string) ?? 0) || 1;
    const pageSize = parseInt((query.pageSize as string) ?? 0) || 48;

    filters['page'] = page;
    filters['pageSize'] = pageSize;
    filters['filter'] = `variants.merchantId = ${merchant.merchantId}`;

    const {data, meta} = await fetchProducts(filters);

    const products = data.map(product => {
        return {
            ...product,
            variants: product.variants.filter(variant => variant.merchantId === merchant.merchantId)
        };
    });

    return {
        props: {
            initialProducts: products,
            meta,
            filters,
            merchant
        },
    };
}


ShopPage.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>, pageProps: any) => getShopResultsLayout(page, pageProps);

export default ShopPage;
