import Link from "next/link";
import {Suspense, useState} from "react";
import {Package2} from "lucide-react";
import {getLayout} from "@/components/layouts/layout";
import {capitalize} from "lodash";
import {fetchMaterialBySlug} from "@/framework/material.ssr";
import {fetchColorBySlug} from "@/framework/color.ssr";
import {fetchBrandBySlug} from "@/framework/brand.ssr";
import {fetchProducts} from "@/framework/product";
import PageSizeSelector from "@/components/filters/page-size-selector";
import {ProductsGrid} from "@/components/products/products-grid";
import {CategoryFilter} from "@/components/filters/category-filter";
import PageSortSelector from "@/components/filters/page-sort-selector";
import {currentBrandAtom, currentCategoryAtom, currentColorAtom, currentMaterialAtom, sortsAtom} from "@/store/filters";
import {Breadcrumbs} from "@/components/breadcrumbs/breadcrumbs";
import {SearchFilter} from "@/components/filters/search-filter";
import {useAtom} from "jotai/index";
import {Category, Entity} from "@/types";
import {BrandFilter} from "@/components/filters/brand-filter";
import {ColorFilter} from "@/components/filters/color-filter";
import {MaterialFilter} from "@/components/filters/material-filter";
import {fetchAllCategories, fetchCategories} from "@/framework/category.ssr";
import {PriceRangeFilter} from "@/components/filters/price-range-filter";


function MoebelPage({
                        sortedProducts,
                        page,
                        pageCount,
                        total,
                        initialCategory
                    }) {
    const [loading, setLoading] = useState(false);
    const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
    const [currentColor, setCurrentColor] = useAtom(currentColorAtom);
    const [currentMaterial, setCurrentMaterial] = useAtom(currentMaterialAtom);
    const [currentBrand, setCurrentBrand] = useAtom(currentBrandAtom);


    const category = capitalize(currentCategory?.name) ?? 'Moebel';
    const brand = currentBrand && (' von der Marke ' + capitalize(currentBrand?.label));
    const color = currentColor && (' in der Farbe ' + capitalize(currentColor?.label));
    const material = currentMaterial && (' aus ' + capitalize(currentMaterial?.label));

    const title = category + (brand ?? '') + (color ?? '') + (material ?? '');

    return (
        <>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-auto items-center border-b p-6  lg:px-4">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Package2 className="h-6 w-6"/>
                                <span className="">{capitalize(currentCategory?.name ?? 'Moebel')}</span>
                            </Link>
                        </div>
                        <div className="flex-1 h-full">
                            <Suspense fallback={<div>Loading...</div>}>
                                <CategoryFilter current={initialCategory}/>
                                <BrandFilter/>
                                <ColorFilter/>
                                <PriceRangeFilter/>
                                <MaterialFilter/>
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <header className="flex h-auto items-center gap-4 border-b bg-muted/40 p-4  lg:px-6">
                        <SearchFilter/>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
                                <span className={'font-light text-xs text-gray-500'}>{total} Produkte</span>
                            </div>
                            <div className={'flex gap-4 justify-center'}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <PageSizeSelector/>
                                    <PageSortSelector/>
                                </Suspense>

                            </div>

                        </div>

                        <Suspense fallback={<div>Loading Breadcrumbs...</div>}>
                            <Breadcrumbs/>
                        </Suspense>

                        {sortedProducts.length === 0 ? (
                            <NoProductsFound/>
                        ) : (
                            <ProductsGrid products={sortedProducts} page={page} pageCount={pageCount}/>
                        )}

                    </main>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps({params, query}) {
    const sorts = sortsAtom;
    const filters: any = {};

    let initialBrand = null;
    let initialColor = null;
    let initialMaterial = null;
    let initialCategory: Category | Entity<Category> | null = null;

    const [categoryParam, materialParam, colorParam, brandParam] = [
        params.params?.find((p) => p.startsWith('category-')),
        params.params?.find((p) => p.startsWith('material-')),
        params.params?.find((p) => p.startsWith('color-')),
        params.params?.find((p) => p.startsWith('brand-')),
    ];

    if (categoryParam) {
        const data = await fetchCategories({slug: categoryParam});
        initialCategory = data[0];

    }

    if (materialParam) {
        initialMaterial = await fetchMaterialBySlug(materialParam);
    }
    if (colorParam) {
        const data = await fetchColorBySlug(colorParam);
        initialColor = data[0]
    }
    if (brandParam) {
        initialBrand = await fetchBrandBySlug(brandParam);
    }

    // const categoryIds = getOriginalCategoryIds(initialCategory);

    const categoryName = getLabel(categoryParam, 'category-');
    const materialName = getLabel(materialParam, 'material-');
    const colorName = getLabel(colorParam, 'color-');
    const brandName = getLabel(brandParam, 'brand-');

    const parentCategoryLabels = initialCategory?.parent_categories?.map(item => item.name) ?? [];
    const searchTerms = [categoryName, brandName, colorName, materialName, query?.search].filter(Boolean);

    console.log("searchTerms: ", searchTerms)


    //merge search terms to single string and set it as search term
    filters['searchTerms'] = searchTerms.join(' ');

    const colorIds = [];

    if (initialColor) {
        colorIds.push(initialColor.id);
        const childColorIds = initialColor?.child_colors?.data ? initialColor?.child_colors?.data.map(item => item.id) : [];
        colorIds.push(...childColorIds);
    }

    filters['variants.originalColor'] = colorIds;

    if (query.minPrice || query.maxPrice) {
        filters['minPrice'] = query.minPrice ? parseInt(query.minPrice) : 0
        filters['maxPrice'] = query.maxPrice ? parseInt(query.maxPrice) : 10000
    }

    let sort = sorts.find(el => el.id === query.sort) ?? null;
    if (query.sort) {
        // filters['sort'] = `${sort.dimension}:${sort.value}`;
    }

    const page = parseInt(query.page ?? 0) || 1;
    const pageSize = parseInt(query.pageSize ?? 0) || 48;

    filters['page'] = page;
    filters['pageSize'] = pageSize;


    const {data, meta} = await fetchProducts(filters);



    let sortedProducts = data;
    let total = meta.total;
    let pageCount = meta.totalPages;

    return {
        props: {
            sortedProducts,
            page,
            pageCount,
            total,
            initialCategory
        },
    };
}

const getLabel = (str: string, prefix: string) => {
    return str?.split(prefix,)[1] ?? null;    // remove the prefix
}

const NoProductsFound = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h1 className="text-2xl font-bold mt-6">Keine Produkte gefunden</h1>
        <p className="mt-2 text-gray-600">Versuchen Sie, Ihre Filtereinstellungen anzupassen oder suchen Sie nach anderen Produkten.</p>
        <Link href="/">
            <span className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Zur Startseite
            </span>
        </Link>
    </div>
);

MoebelPage.getLayout = getLayout;
export default MoebelPage;
