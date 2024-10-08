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

const Index: NextPageWithLayout<typeof getServerSideProps> = (props: SearchPageProps) => {
    const {initialProducts, page, meta, initialCategory, filters} = props;
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>(initialProducts);


    return (
        <>
            <ProductsGrid initialFilters={filters} initialProducts={products} initialPage={meta?.page} pageCount={meta?.totalPages ?? 0}  initialLoading={loading}/>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { params, query } = context;
    const filters: any = {};

    const pathSegments = params?.params as string[];

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
            console.log("response: ", response);
            const data: Merchant[] = response.data.map((entity: Entity<Merchant>) => {
                const id = entity.id;
                const modifiedItem: Merchant = {
                    ...entity.attributes,
                    id: id
                };
                return modifiedItem;
            });
            return data[0];
        })



    let searchTerms: string[] = [];
    let searchTermFromPath = '';

    if (searchTermFromPath) {
        searchTerms.push(searchTermFromPath);
    }

    // Extract search terms from both the URL path and the query string
    if (query.search) {
        searchTerms = [...searchTerms, ...(query.search as string).split(' ')];
    }

    const [
        materialParam, colorParam, shapeParam, deliveryParam,
        styleParam, heightParam, depthParam, widthParam
    ] = [
        pathSegments?.find((p: string) => p.startsWith('material:')),
        pathSegments?.find((p: string) => p.startsWith('farbe:')),
        pathSegments?.find((p: string) => p.startsWith('marke:')),
        pathSegments?.find((p: string) => p.startsWith('form:')),
        pathSegments?.find((p: string) => p.startsWith('lieferzeit:')),
        pathSegments?.find((p: string) => p.startsWith('stil:')),
        pathSegments?.find((p: string) => p.startsWith('hoehe:')),
        pathSegments?.find((p: string) => p.startsWith('tiefe:')),
        pathSegments?.find((p: string) => p.startsWith('breite:')),
    ];

    let overallFilter = '';



    if (shapeParam) {
        const shapes = shapeParam.replace('form:', '').split('.');
        const shapeFilter = `variants.shape IN [${shapes.map(shape => `"${shape}"`).join(', ')}]`;
        overallFilter = overallFilter ? `${overallFilter} AND ${shapeFilter}` : shapeFilter;
    }

    if (deliveryParam) {
        const deliveries = deliveryParam.replace('lieferzeit:', '').split('.');
        const deliveryFilter = `variants.deliveryTimes IN [${deliveries.map(time => `"${time}"`).join(', ')}]`;
        overallFilter = overallFilter ? `${overallFilter} AND ${deliveryFilter}` : deliveryFilter;
    }

    if (styleParam) {
        const styles = styleParam.replace('stil:', '').split('.');
        const styleFilter = `variants.style IN [${styles.map(style => `"${style}"`).join(', ')}]`;
        overallFilter = overallFilter ? `${overallFilter} AND ${styleFilter}` : styleFilter;
    }

    if (materialParam) {
        const materials = materialParam.replace('material:', '').split('.');
        const materialFilter = `variants.materials IN [${materials.map(material => `"${material}"`).join(', ')}]`;
        overallFilter = overallFilter ? `${overallFilter} AND ${materialFilter}` : materialFilter;
    }

    if (heightParam) {
        const heights = heightParam.replace('hoehe:', '').split('.');
        const heightFilter = `variants.height IN [${heights.map(height => `"${height}"`).join(', ')}]`;
        overallFilter = overallFilter ? `${overallFilter} AND ${heightFilter}` : heightFilter;
    }

    if (depthParam) {
        const depths = depthParam.replace('tiefe:', '').split('.');
        const depthFilter = `variants.depth IN [${depths.map(depth => `"${depth}"`).join(', ')}]`;
        overallFilter = overallFilter ? `${overallFilter} AND ${depthFilter}` : depthFilter;
    }

    if (widthParam) {
        const widths = widthParam.replace('breite:', '').split('.');
        const widthFilter = `variants.width IN [${widths.map(width => `"${width}"`).join(', ')}]`;
        overallFilter = overallFilter ? `${overallFilter} AND ${widthFilter}` : widthFilter;
    }

    if (colorParam) {
        const colors = colorParam.replace('farbe:', '').split('.');
        const colorFilter = `variants.colors IN [${colors.map(color => `"${color.toUpperCase()}"`).join(', ')}]`;
        overallFilter = overallFilter ? `${overallFilter} AND ${colorFilter}` : colorFilter;
    }

    // Extract minPrice and maxPrice from query and add to overallFilter
    const minPrice = query.minPrice ? parseFloat(query.minPrice as string) : undefined;
    const maxPrice = query.maxPrice ? parseFloat(query.maxPrice as string) : undefined;

    if (minPrice !== undefined) {
        const minPriceFilter = `variants.price >= ${minPrice}`;
        overallFilter = overallFilter ? `${overallFilter} AND ${minPriceFilter}` : minPriceFilter;
    }

    if (maxPrice !== undefined) {
        const maxPriceFilter = `variants.price <= ${maxPrice}`;
        overallFilter = overallFilter ? `${overallFilter} AND ${maxPriceFilter}` : maxPriceFilter;
    }

    overallFilter = overallFilter ? `${overallFilter} AND variants.merchantId = ${merchant.merchantId}` : `variants.merchantId = ${merchant.merchantId}`;

    console.log("overallFilter: ", overallFilter);

    // Concatenate search terms into a single string
    filters['searchTerms'] = searchTerms.join(' ');


    if (overallFilter) {
        filters['filter'] = overallFilter;
    }

    const page = parseInt((query.page as string) ?? 0) || 1;
    const pageSize = parseInt((query.pageSize as string) ?? 0) || 48;

    filters['page'] = page;
    filters['pageSize'] = pageSize;


    const { data, meta } = await fetchProducts(filters);

    const filteredData = data.filter(product => product.variants.every(variant => variant.merchantId === merchant.merchantId));

    return {
        props: {
            initialProducts: filteredData,
            meta,
            filters,
            merchant
        },
    };
}


Index.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>, pageProps: any) => getShopResultsLayout(page, pageProps);

export default Index;
