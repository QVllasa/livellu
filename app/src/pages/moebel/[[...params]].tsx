import Link from "next/link";
import {Suspense, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Package2, Search} from "lucide-react";
import {Input} from "@/shadcn/components/ui/input";
import {getLayout} from "@/components/layouts/layout";
import {capitalize, debounce} from "lodash";
import {BrandFilter} from "@/components/filters/brand-filter";
import {ColorFilter} from "@/components/filters/color-filter";
import {MaterialFilter} from "@/components/filters/material-filter";
import {fetchCategoryBySlug} from "@/framework/category.ssr";
import {fetchMaterialBySlug} from "@/framework/material.ssr";
import {fetchColorBySlug} from "@/framework/color.ssr";
import {fetchBrandBySlug} from "@/framework/brand.ssr";
import {fetchProducts} from "@/framework/product";
import {Breadcrumbs} from "@/components/breadcrumbs/breadcrumbs";
import PageSizeSelector from "@/components/filters/page-size-selector";

import {ArrowPathIcon} from "@heroicons/react/16/solid";
import {ProductsGrid} from "@/components/products/products-grid";
import {CategoryFilter} from "@/components/filters/category-filter";

function MoebelPage({
                        initialCategory,
                        products,
                        page,
                        pageSize,
                        pageCount,
                        total,
                    }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Debounce function for search input
    const debouncedSearch = debounce((term) => {
        setLoading(true);
        const query = {
            ...router.query,
            search: term,
        };
        router.push({
            pathname: router.pathname,
            query,
        });
    }, 500);

    const handleSearchChange = (e: { target: { value: any; }; }) => {
        const {value} = e.target;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        if (router.query.search) {
            setSearchTerm(router.query.search);
        }
        setLoading(false);
    }, [router.query.search, products]);


    return (
        <>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-4">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Package2 className="h-6 w-6"/>
                                <span className="">{capitalize(initialCategory?.name ?? 'Moebel')}</span>
                            </Link>
                        </div>
                        <div className="flex-1 h-full">
                            <Suspense fallback={<div>Loading...</div>}>
                                <BrandFilter/>
                                <CategoryFilter/>
                                <ColorFilter/>
                                <MaterialFilter/>
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                        <div className="w-full flex-1">
                            <form>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </form>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
                                <span className={'font-light text-xs text-gray-500'}>{total} Produkte</span>
                            </div>
                            <PageSizeSelector currentSize={pageSize}/>
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

// Fetch data at request time for SSR
export async function getServerSideProps({params, query}) {


    const filters = {$and: []};

    let initialBrand = null;
    let initialColor = null;
    let initialMaterial = null;
    let initialCategory = null;

    const [categoryParam, materialParam, colorParam, brandParam] = [
        params.params?.find(p => p.startsWith('category-')),
        params.params?.find(p => p.startsWith('material-')),
        params.params?.find(p => p.startsWith('color-')),
        params.params?.find(p => p.startsWith('brand-')),
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

    const filtersToApply: any[] = [
        initialMaterial ? {original_material: initialMaterial[0].label} : null,
        initialColor ? {original_color: initialColor[0].label} : null,
        initialBrand ? {brandName: initialBrand[0].label} : null,
    ].filter(Boolean);

    filters.$and.push(...filtersToApply);

    if (query.search) {
        const searchTerms = query.search.split(' ').map((term: string) => term.trim());
        const searchFilters: any[] = searchTerms.map((term: string) => ({
            $or: [
                {productName: {$contains: term}},
                {description: {$contains: term}},
                {shortDescription: {$contains: term}},
            ]
        }));
        filters.$and.push(...searchFilters);
    }

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 30; // Adjust the page size as needed

    const {products, total, pageCount} = await fetchProducts(filters, {page, pageSize}, 'productName', 'asc');


    return {
        props: {
            initialCategory,
            products,
            page,
            pageSize,
            pageCount,
            total,
        },
    };
}

MoebelPage.getLayout = getLayout;
export default MoebelPage;
