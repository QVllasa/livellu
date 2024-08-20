import {JSXElementConstructor, ReactElement, useEffect, useState} from "react";
import {fetchProducts} from "@/framework/product";
import {Category, MetaData, NextPageWithLayout, Product} from "@/types";
import {GetServerSidePropsContext} from "next";
import {getResultsLayout} from "@/components/layouts/results-layout";
import {ProductsGrid} from "@/components/products/products-grid";
import {fetchAllBrands} from "@/framework/brand.ssr";
import {fetchCategories} from "@/framework/category.ssr";

interface MoebelPageProps {
    initialProducts: Product[];
    page: number;
    meta: MetaData;
    initialCategory: Category | null;
    filters: any;
}

const Index: NextPageWithLayout<typeof getServerSideProps> = (props: MoebelPageProps) => {
    const {initialProducts, page, meta, initialCategory, filters} = props;
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [currentPage, setCurrentPage] = useState<number>(page);


    console.log("filters: ", filters);


    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const loadMoreProducts = async () => {
        if (currentPage >= meta.totalPages || loading) return;

        setLoading(true);
        try {
            filters['page'] = currentPage + 1;
            const {data, meta} = await fetchProducts(filters);

            setProducts((prevProducts) => [...prevProducts, ...data]);
            setCurrentPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error("Failed to load more products:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <ProductsGrid products={products} page={currentPage} pageCount={meta?.totalPages ?? 0} loadMoreProducts={loadMoreProducts} loading={loading}/>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { params, query, resolvedUrl } = context;
    const filters: any = {};

    const categorySegments = params?.params as string[];

    const initialCategory = await fetchCategories({ identifier: categorySegments[0] });

    if (initialCategory.length === 0) {
        return {
            notFound: true,
        };
    }

    let searchTerm = '';

    for (let i = categorySegments.length - 1; i >= 0; i--) {
        if (!categorySegments[i].includes(':')) {
            searchTerm = categorySegments[i];
            break;
        }
    }

    const [materialParam, colorParam, brandParam, shapeParam, deliveryParam, styleParam, heightParam, depthParam, widthParam] = [
        categorySegments?.find((p: string) => p.startsWith('material:')),
        categorySegments?.find((p: string) => p.startsWith('farbe:')),
        categorySegments?.find((p: string) => p.startsWith('marke:')),
        categorySegments?.find((p: string) => p.startsWith('form:')),
        categorySegments?.find((p: string) => p.startsWith('lieferzeit:')),
        categorySegments?.find((p: string) => p.startsWith('stil:')),
        categorySegments?.find((p: string) => p.startsWith('hoehe:')),
        categorySegments?.find((p: string) => p.startsWith('tiefe:')),
        categorySegments?.find((p: string) => p.startsWith('breite:')),
    ];

    let overallFilter = '';

    if (brandParam) {
        const brandNames = brandParam.replace('marke:', '').split('.');
        const allBrands = await fetchAllBrands();
        const brandFilter = brandNames.map(brand => `brandName = "${allBrands.find(el => el.slug === brand)?.label}"`).join(' OR ');
        overallFilter = brandFilter;
    }

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

    filters['searchTerms'] = searchTerm;

    if (overallFilter) {
        filters['filter'] = overallFilter;
    }

    const page = parseInt((query.page as string) ?? 0) || 1;
    const pageSize = parseInt((query.pageSize as string) ?? 0) || 48;

    filters['page'] = page;
    filters['pageSize'] = pageSize;

    const { data, meta } = await fetchProducts(filters);

    return {
        props: {
            initialProducts: data,
            meta,
            initialCategory,
            filters,
        },
    };
}


Index.getLayout = (page: ReactElement<any, string | JSXElementConstructor<any>>, pageProps: any) => getResultsLayout(page, pageProps);

export default Index;
