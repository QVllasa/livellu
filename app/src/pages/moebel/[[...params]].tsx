import Link from "next/link";
import {Suspense, useState} from "react";
import {Package2} from "lucide-react";
import {getLayout} from "@/components/layouts/moebel-page-layout";
import {capitalize} from "lodash";
import {fetchMaterialBySlug} from "@/framework/material.ssr";
import {fetchColorBySlug} from "@/framework/color.ssr";
import {fetchProducts} from "@/framework/product";
import PageSizeSelector from "@/components/filters/page-size-selector";
import {ProductsGrid} from "@/components/products/products-grid";
import {CategoryFilter} from "@/components/filters/category-filter";
import PageSortSelector from "@/components/filters/page-sort-selector";
import {currentBrandAtom, currentCategoryAtom, currentColorAtom, currentMaterialAtom, sortsAtom} from "@/store/filters";
import {Breadcrumbs} from "@/components/breadcrumbs/breadcrumbs";
import {SearchFilter} from "@/components/filters/search-filter";
import {useAtom} from "jotai/index";
import {Category, Color, Entity, Product} from "@/types";
import {BrandFilter} from "@/components/filters/brand-filter";
import {ColorFilter} from "@/components/filters/color-filter";
import {MaterialFilter} from "@/components/filters/material-filter";
import {fetchCategories} from "@/framework/category.ssr";
import {PriceRangeFilter} from "@/components/filters/price-range-filter";
import {GetServerSidePropsContext} from "next";
import {Button} from "@/shadcn/components/ui/button";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shadcn/components/ui/drawer";


interface MoebelPageProps {
    initialProducts: Product[];
    page: number;
    pageCount: number;
    total: number;
    initialCategory: Category | null;
}

function MoebelPage({initialProducts, page, pageCount, total, initialCategory}: MoebelPageProps) {
    const [loading, setLoading] = useState(false);
    const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
    const [currentColor, setCurrentColor] = useAtom(currentColorAtom);
    const [currentMaterial, setCurrentMaterial] = useAtom(currentMaterialAtom);
    const [currentBrand, setCurrentBrand] = useAtom(currentBrandAtom);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [currentPage, setCurrentPage] = useState<number>(page);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const category = capitalize(currentCategory?.name) ?? 'Moebel';
    const brand = currentBrand && (' von der Marke ' + capitalize(currentBrand?.label));
    const color = currentColor && (' in der Farbe ' + capitalize(currentColor?.label));
    const material = currentMaterial && (' aus ' + capitalize(currentMaterial?.label));

    const title = category + (brand ?? '') + (color ?? '') + (material ?? '');

    const loadMoreProducts = async () => {
        if (currentPage >= pageCount || loading) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/products?page=${currentPage + 1}`);
            const data = await response.json();

            setProducts((prevProducts) => [...prevProducts, ...data.products]);
            setCurrentPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error("Failed to load more products:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-auto items-center border-b p-6 lg:px-4">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Package2 className="h-6 w-6"/>
                                <span className="">{capitalize(currentCategory?.name ?? 'Moebel')}</span>
                            </Link>
                        </div>
                        <div className="flex-1">
                            <Suspense fallback={<div>Loading...</div>}>
                                <div className={'w-64 p-4'}>
                                    <CategoryFilter current={initialCategory}/>
                                    <PriceRangeFilter/>
                                    <BrandFilter/>
                                    <ColorFilter/>
                                    <MaterialFilter/>
                                </div>
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <header className="flex h-auto items-center gap-4 border-b bg-muted/40 p-4 lg:px-6 hidden lg:block">
                        <SearchFilter/>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        <div className="flex items-center justify-between hidden lg:block">
                            <div>
                                <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
                                <span className={'font-light text-xs text-gray-500'}>
                                    {total >= 1000 ? 'mehr als 1000 Produkte gefunden' : `${total} Produkte gefunden`}
                                </span>
                            </div>
                            <div className={'flex gap-4 justify-center'}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <PageSizeSelector/>
                                    <PageSortSelector/>
                                </Suspense>
                            </div>
                        </div>
                        {/* Mobile Filters Button */}
                        <div className="lg:hidden relative">
                            <Drawer >
                                <DrawerTrigger asChild>
                                    <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>
                                        Open Filters
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent className={'h-2/3 '}>
                                    <div className={'h-full relative flex flex-col py-3'}>
                                        <DrawerHeader>
                                            <DrawerTitle>Filter einstellen</DrawerTitle>
                                            {/*<DrawerDescription>Set your daily activity goal.</DrawerDescription>*/}
                                        </DrawerHeader>
                                        <div className={'h-full overflow-auto p-4'}>
                                            <CategoryFilter current={initialCategory}/>
                                            <PriceRangeFilter/>
                                            <BrandFilter/>
                                            <ColorFilter/>
                                            <MaterialFilter/>
                                        </div>
                                        <DrawerFooter className={''}>
                                            <DrawerClose asChild>
                                                <Button variant="outline">Schließen</Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                        <Suspense fallback={<div>Loading Breadcrumbs...</div>}>
                            <Breadcrumbs/>
                        </Suspense>
                        {products.length === 0 ? (
                            <NoProductsFound/>
                        ) : (
                            <ProductsGrid products={products} page={currentPage} pageCount={pageCount} loadMoreProducts={loadMoreProducts} loading={loading}/>
                        )}
                        {loading && <div>Loading...</div>}
                    </main>
                </div>

            </div>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const {params, query} = context;
    const sorts = sortsAtom;
    const filters: any = {};

    let initialBrand = null;
    let initialColor = null;
    let initialMaterial = null;
    let initialCategory: Category | Entity<Category> | null = null;

    const [categoryParam, materialParam, colorParam, brandParam] = [
        (params?.params as string[])?.find((p: string) => p.startsWith('category-')),
        (params?.params as string[])?.find((p: string) => p.startsWith('material-')),
        (params?.params as string[])?.find((p: string) => p.startsWith('color-')),
        (params?.params as string[])?.find((p: string) => p.startsWith('brand-')),
    ];

    if (categoryParam) {
        const data = await fetchCategories({slug: categoryParam});
        initialCategory = data[0];
    }

    if (materialParam) {
        initialMaterial = await fetchMaterialBySlug(materialParam);
    }
    if (colorParam) {
        initialColor = await fetchColorBySlug(colorParam as string);
    }

    const categoryName = getLabel(categoryParam, 'category-');
    const materialName = getLabel(materialParam, 'material-');
    const colorName = getLabel(colorParam, 'color-');
    const brandName = getLabel(brandParam, 'brand-');

    const searchTerms = [categoryName, brandName, colorName, materialName, query?.search].filter(Boolean);

    filters['searchTerms'] = searchTerms.join(' ');

    const colorIds = [];

    if (initialColor) {
        colorIds.push(initialColor.id);
        const childColorIds = initialColor?.child_colors ? initialColor?.child_colors?.map((item: Color) => item.id) : [];
        colorIds.push(...childColorIds);
    }

    filters['variants.originalColor'] = colorIds;

    if (query.minPrice || query.maxPrice) {
        filters['minPrice'] = query.minPrice ? parseInt(query.minPrice as string) : 0;
        filters['maxPrice'] = query.maxPrice ? parseInt(query.maxPrice as string) : 10000;
    }

    let sort = sorts.find(el => el.id === query.sort) ?? null;
    if (query.sort) {
        // filters['sort'] = `${sort.dimension}:${sort.value}`;
    }

    const page = parseInt((query.page as string) ?? 0) || 1;
    const pageSize = parseInt((query.pageSize as string) ?? 0) || 48;

    filters['page'] = page;
    filters['pageSize'] = pageSize;

    const {data, meta} = await fetchProducts(filters);

    let sortedProducts = data;
    let total = meta?.total ?? 0;
    let pageCount = meta?.totalPages ?? 0;

    return {
        props: {
            initialProducts: sortedProducts,
            page,
            pageCount,
            total,
            initialCategory
        },
    };
}

const getLabel = (str: string | undefined, prefix: string) => {
    return str?.split(prefix,)[1] ?? null;
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
