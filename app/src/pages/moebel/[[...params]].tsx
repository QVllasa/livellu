// pages/[[...params]].tsx
import Link from "next/link";
import { CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from "lucide-react";
import { Badge } from "@/shadcn/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shadcn/components/ui/dropdown-menu";
import { Input } from "@/shadcn/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/shadcn/components/ui/sheet";
import { getLayout } from "@/components/layouts/layout";
import { Button } from '@/shadcn/components/ui/button';
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { Suspense } from "react";
import { currentCategoryAtom } from "@/store/category";
import { useAtom } from "jotai";
import { capitalize } from "lodash";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { BrandFilter } from "@/components/filters/brand-filter";
import { ProductsGrid } from "@/components/products/products-grid";
import { CategoryFilter } from "@/components/filters/category-filter";
import { ColorFilter } from "@/components/filters/color-filter";
import { MaterialFilter } from "@/components/filters/material-filter";
import { findBrandBySlug, findCategoryBySlug, findColorBySlug, findMaterialBySlug } from "@/framework/utils/find-by-slug";
import { fetchProducts } from "@/framework/product";
import { fetchCategories } from "@/framework/category.ssr";
import { fetchAllMaterials } from "@/framework/material.ssr";
import { fetchAllColors } from "@/framework/color.ssr";
import { fetchAllBrands } from "@/framework/brand.ssr";
import Head from "next/head";
import PageSizeSelector from "@/components/filters/page-size-selector";

function MoebelPage({
                        canonicalUrl,
                        allBrands,
                        allColors,
                        allMaterials,
                        allCategories,
                        products,
                        page,
                        pageSize,
                        pageCount,
                        total,
                    }) {
    const [currentCategory] = useAtom(currentCategoryAtom);

    return (
        <>
            <Head>
                <link rel="canonical" href={`https://www.yourdomain.com/${canonicalUrl}`} />
                <title>{canonicalUrl}</title>
                <meta name="description" content={canonicalUrl} />
            </Head>

            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-4">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Package2 className="h-6 w-6" />
                                <span className="">{capitalize(currentCategory?.name ?? 'Moebel')}</span>
                            </Link>
                        </div>
                        <div className="flex-1 h-full">
                            <Suspense fallback={<div>Loading...</div>}>
                                <BrandFilter allBrands={allBrands} />
                                <CategoryFilter allCategories={allCategories} />
                                <ColorFilter allColors={allColors} />
                                <MaterialFilter allMaterials={allMaterials} />
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">

                        <div className="w-full flex-1">
                            <form>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input type="search" placeholder="Search products..." className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3" />
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

                            <PageSizeSelector currentSize={pageSize} />
                        </div>
                        <Suspense fallback={<ArrowPathIcon className="mr-2 h-12 w-12 animate-spin" />}>
                            <Breadcrumbs />
                        </Suspense>
                        <Suspense fallback={<ArrowPathIcon className="mr-2 h-12 w-12 animate-spin" />}>
                            <ProductsGrid products={products} page={page} pageCount={pageCount} />
                        </Suspense>
                    </main>
                </div>
            </div>
        </>
    );
}

// Fetch data at request time for SSR
export async function getServerSideProps({ params, query }) {
    const [
        allBrands,
        allColors,
        allMaterials,
        allCategories,
    ] = await Promise.all([
        fetchAllBrands(),
        fetchAllColors(),
        fetchAllMaterials(),
        fetchCategories()
    ]);
    const filters = { $and: [] };

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
        initialCategory = findCategoryBySlug(allCategories, categoryParam);
    }
    if (materialParam) {
        initialMaterial = findMaterialBySlug(allMaterials, materialParam);
    }
    if (colorParam) {
        initialColor = findColorBySlug(allColors, colorParam);
    }
    if (brandParam) {
        initialBrand = findBrandBySlug(allBrands, brandParam);
    }

    const filtersToApply = [
        // initialCategory ? { category: initialCategory.name } : null,
        initialMaterial ? { original_material: initialMaterial.label } : null,
        initialColor ? { original_color: initialColor.label } : null,
        initialBrand ? { brandName: initialBrand.label } : null,
    ].filter(Boolean);

    filters.$and.push(...filtersToApply);

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 30; // Adjust the page size as needed


    console.log("selected filters: ", JSON.stringify(filters))

    const { products, total, pageCount } = await fetchProducts(filters, { page, pageSize }, 'productName', 'asc');

    const canonicalUrl = [
        initialCategory ? `${initialCategory.slug}` : null,
        initialMaterial ? `${initialMaterial.slug}` : null,
        initialColor ? `${initialColor.slug}` : null,
        initialBrand ? `${initialBrand.slug}` : null,
    ].filter(Boolean).join('/');



    return {
        props: {
            canonicalUrl,
            allBrands,
            allColors,
            allMaterials,
            allCategories,
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