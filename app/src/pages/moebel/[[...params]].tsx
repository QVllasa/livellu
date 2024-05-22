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
import { Suspense, useEffect } from "react";
import { useRouter } from "next/router";
import { currentCategoryAtom } from "@/store/category";
import { useAtom } from "jotai";
import { capitalize } from "lodash";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { BrandFilter } from "@/components/filters/brand-filter";
import { ProductsGrid } from "@/components/products/products-grid";
import { CategoryFilter } from "@/components/filters/category-filter";
import { ColorFilter } from "@/components/filters/color-filter";
import { MaterialFilter } from "@/components/filters/material-filter";
import { findBrandBySlug, findColorBySlug, findMaterialBySlug, findCategoryBySlug } from "@/framework/utils/find-by-slug";
import {fetchProducts} from "@/framework/product";
import {fetchCategories} from "@/framework/category.ssr";
import {fetchMaterials} from "@/framework/material.ssr";
import {fetchColors} from "@/framework/color.ssr";
import {fetchBrands} from "@/framework/brand.ssr";

function MoebelPage({ allBrands, allColors, allMaterials, allCategories, products, initialBrand, initialColor, initialMaterial, initialCategory }) {
    const router = useRouter();
    const { params } = router.query;
    const [currentCategory] = useAtom(currentCategoryAtom);

    // Set initial state for atoms if needed
    useEffect(() => {
        // You can set initial state here if necessary
    }, [initialBrand, initialColor, initialMaterial, initialCategory]);

    return (
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
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                                    <Package2 className="h-6 w-6" />
                                    <span className="sr-only">Acme Inc</span>
                                </Link>
                                <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </Link>
                                <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                                    <ShoppingCart className="h-5 w-5" />
                                    Orders
                                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge>
                                </Link>
                                <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                                    <Package className="h-5 w-5" />
                                    Products
                                </Link>
                                <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                                    <Users className="h-5 w-5" />
                                    Customers
                                </Link>
                                <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                                    <LineChart className="h-5 w-5" />
                                    Analytics
                                </Link>
                            </nav>
                            <div className="mt-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Upgrade to Pro</CardTitle>
                                        <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button size="sm" className="w-full">Upgrade</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="Search products..." className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3" />
                            </div>
                        </form>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <div className="flex items-center">
                        <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
                    </div>
                    <Suspense fallback={<ArrowPathIcon className="mr-2 h-12 w-12 animate-spin" />}>
                        <Breadcrumbs />
                    </Suspense>
                    <Suspense fallback={<ArrowPathIcon className="mr-2 h-12 w-12 animate-spin" />}>
                        <ProductsGrid products={products} />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}

// Fetch dynamic paths for SSG
export async function getStaticPaths() {
    const allBrands = await fetchBrands();
    const allColors = await fetchColors();
    const allMaterials = await fetchMaterials();
    const allCategories = await fetchCategories();

    const paths = [];

    // Generate paths for each combination of brand, color, material, and category
    allBrands.forEach(brand => {
        paths.push({ params: { params: [brand.slug] } });
    });

    allColors.forEach(color => {
        paths.push({ params: { params: [color.slug] } });
    });

    allMaterials.forEach(material => {
        paths.push({ params: { params: [material.slug] } });
    });

    allCategories.forEach(category => {
        paths.push({ params: { params: [category.slug] } });
    });

    return {
        paths,
        fallback: 'blocking', // 'blocking' or 'true' allows new paths to be generated at runtime
    };
}

// Fetch data at build time for SSG
export async function getStaticProps({ params }) {
    const allBrands = await fetchBrands();
    const allColors = await fetchColors();
    const allMaterials = await fetchMaterials();
    const allCategories = await fetchCategories();
    const { params: routeParams = [] } = params;
    const filters = { $and: [] };

    let initialBrand = null;
    let initialColor = null;
    let initialMaterial = null;
    let initialCategory = null;

    // Loop through params and find if any of them is a brand, color, material, or category
    for (const param of routeParams) {
        const brand = findBrandBySlug(allBrands, param);
        const color = findColorBySlug(allColors, param);
        const material = findMaterialBySlug(allMaterials, param);
        const category = findCategoryBySlug(allCategories, param);
        if (brand) {
            initialBrand = brand;
            filters.$and.push({ brandName: brand.label });
        } else if (color) {
            initialColor = color;
            filters.$and.push({ original_color: color.label });
        } else if (material) {
            initialMaterial = material;
            filters.$and.push({ original_material: material.label });
        }
        // else if (category) {
        //     initialCategory = category;
        //     filters.$and.push({ category: category.name });
        // }
    }

    const products = await fetchProducts(filters);

    return {
        props: {
            allBrands,
            allColors,
            allMaterials,
            allCategories,
            products,
            initialBrand,
            initialColor,
            initialMaterial,
            initialCategory,
        },
        revalidate: 60, // Revalidate every 60 seconds to update the data
    };
}

MoebelPage.getLayout = getLayout;
export default MoebelPage;
