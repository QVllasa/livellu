import Link from "next/link";
import {Suspense, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Package2, Search} from "lucide-react";
import {Input} from "@/shadcn/components/ui/input";
import {getLayout} from "@/components/layouts/layout";
import {debounce} from "lodash";
import {fetchCategoryBySlug} from "@/framework/category.ssr";
import {fetchMaterialBySlug} from "@/framework/material.ssr";
import {fetchColorBySlug} from "@/framework/color.ssr";
import {fetchBrandBySlug} from "@/framework/brand.ssr";
import {fetchProducts} from "@/framework/product";
import PageSizeSelector from "@/components/filters/page-size-selector";
import {ArrowPathIcon} from "@heroicons/react/16/solid";
import {ProductsGrid} from "@/components/products/products-grid";
import {CategoryFilter} from "@/components/filters/category-filter";
import {PriceRangeFilter} from "@/components/filters/price-range-filter";
import PageSortSelector from "@/components/filters/page-sort-selector";
import {sortsAtom} from "@/store/filters";
import {Breadcrumbs} from "@/components/breadcrumbs/breadcrumbs";
import {SearchFilter} from "@/components/filters/search-filter";
import {BrandFilter} from "@/components/filters/brand-filter";
import {ColorFilter} from "@/components/filters/color-filter";
import {MaterialFilter} from "@/components/filters/material-filter";

function MoebelPage({
                        products,
                        page,
                        pageSize,
                        pageCount,
                        total,
                        sort
                    }) {
    const [loading, setLoading] = useState(false);


    return (
        <>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-auto items-center border-b p-6  lg:px-4">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Package2 className="h-6 w-6"/>
                                {/*<span className="">{capitalize(initialCategory?.name ?? 'Moebel')}</span>*/}
                            </Link>
                        </div>
                        <div className="flex-1 h-full">
                            <Suspense fallback={<div>Loading...</div>}>
                                <PriceRangeFilter setLoading={setLoading}/>
                                <CategoryFilter/>
                                <BrandFilter/>
                                <ColorFilter/>
                                <MaterialFilter/>
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <header className="flex h-auto items-center gap-4 border-b bg-muted/40 p-4  lg:px-6">
                        <SearchFilter setLoading={setLoading}/>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
                                <span className={'font-light text-xs text-gray-500'}>{total} Produkte</span>
                            </div>
                            <div className={'flex gap-4 justify-center'}>
                                <PageSizeSelector currentSize={pageSize}/>
                                <PageSortSelector sort={sort}/>
                            </div>

                        </div>

                        <Suspense fallback={<div>Loading Breadcrumbs...</div>}>
                            <Breadcrumbs/>
                        </Suspense>

                        {loading ? (
                            <div className="flex justify-center items-center">
                                <ArrowPathIcon className="mr-2 h-12 w-12 animate-spin"/>
                            </div>
                        ) : (
                            <ProductsGrid products={products} page={page} pageCount={pageCount}/>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps({params, query}) {
    const sorts = sortsAtom;
    const filters = {"$and": []};

    let initialBrand = null;
    let initialColor = null;
    let initialMaterial = null;
    let initialCategory = null;

    const [categoryParam, materialParam, colorParam, brandParam] = [
        params.params?.find((p) => p.startsWith('category-')),
        params.params?.find((p) => p.startsWith('material-')),
        params.params?.find((p) => p.startsWith('color-')),
        params.params?.find((p) => p.startsWith('brand-')),
    ];

    if (categoryParam) {
        initialCategory = await fetchCategoryBySlug(categoryParam);
    }

    if (materialParam) {
        initialMaterial = await fetchMaterialBySlug(materialParam);
    }
    if (colorParam) {
        initialColor = await fetchColorBySlug(colorParam);
    }
    if (brandParam) {
        initialBrand = await fetchBrandBySlug(brandParam);
    }

    let categoryIds = initialCategory?.original_categories?.data.map(item => item.id) || [];

    if (categoryIds.length === 0 && initialCategory) {
        categoryIds = getOriginalCategoryIds(initialCategory);
    }

    if (categoryIds.length > 0) {
        filters["$and"].push({"categoryIdentifier": {"$in": categoryIds}});
    }


    const filtersToApply = [
        initialMaterial ? {"variants": {"originalMaterial": {$containsi: initialMaterial.label}}} : null,
        initialColor ? {"variants": {"originalColor": {$containsi: initialColor.label}}} : null,
        initialBrand ? {"brandName": initialBrand.label} : null,
    ].filter(Boolean);

    filters["$and"].push(...filtersToApply);

    if (query.search) {
        const searchTerms = query.search.split(' ').map((term) => term.trim());
        const searchFilters = searchTerms.map((term) => ({
            "$or": [
                {"variants": {"productName": {"$contains": term}}},
                {"variants": {"description": {"$contains": term}}},
                {"shortDescription": {"$contains": term}},
            ],
        }));
        filters["$and"].push(...searchFilters);
    }

    if (query.minPrice || query.maxPrice) {
        const minPrice = query.minPrice ? parseInt(query.minPrice) : 0;
        const maxPrice = query.maxPrice ? parseInt(query.maxPrice) : 10000;
        filters["$and"].push({
            "variants": {
                "price": {
                    "$gte": minPrice,
                    "$lte": maxPrice,
                }
            },
        });
    }

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 48;
    const sort = sorts.find(el => el.id === query.sort) ?? null;

    console.log("filter: ", JSON.stringify(filters));

    const {products, total, pageCount} = await fetchProducts(filters, {page, pageSize}, sort);


    return {
        props: {
            products,
            page,
            pageSize,
            pageCount,
            total,
            sort
        },
    };
}


const getOriginalCategoryIds = (category) => {
    let ids = category.original_categories?.data.map(item => item.id) || [];

    if (category.child_categories?.data?.length > 0) {
        category.child_categories.data.forEach(childCategory => {
            ids = ids.concat(getOriginalCategoryIds(childCategory));
        });
    }

    return ids;
};

MoebelPage.getLayout = getLayout;
export default MoebelPage;
