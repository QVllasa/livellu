import {JSXElementConstructor, ReactElement, useEffect, useState} from "react";
import {fetchProducts} from "@/framework/product";
import {Category, Entity, Merchant, MetaData, NextPageWithLayout, Product} from "@/types";
import {GetServerSidePropsContext} from "next";
import {getShopResultsLayout} from "@/components/layouts/shops-results-layout";
import Client from "@/framework/client";
import {useMediaQuery} from "usehooks-ts";
import {ProductsGridMobile} from "@/components/products/products-grid-mobile";
import {ProductsGridDesktop} from "@/components/products/products-grid-desktop";


interface SearchPageProps {
    initialProducts: Product[];
    page: number;
    meta: MetaData;
    initialCategory: Category | null;
    filters: any;
    merchant: Merchant;
}

const ShopPage: NextPageWithLayout<typeof getServerSideProps> = (props: SearchPageProps) => {
    const {initialProducts, page, meta, initialCategory, filters, merchant} = props;
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);


    return (
        <>
            {isMobile ?
                <ProductsGridMobile merchant={merchant} initialFilters={filters} initialProducts={products} initialPage={meta?.page} pageCount={meta?.totalPages ?? 0} initialLoading={loading} meta={meta}/>
                :
                <ProductsGridDesktop merchant={merchant} initialFilters={filters} initialProducts={products} initialPage={meta?.page} pageCount={meta?.totalPages ?? 0} initialLoading={loading} meta={meta}/>
            }
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
