import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Package2, Search } from "lucide-react";
import { Input } from "@/shadcn/components/ui/input";
import { getLayout } from "@/components/layouts/layout";
import { capitalize, debounce } from "lodash";
import { BrandFilter } from "@/components/filters/brand-filter";
import { ColorFilter } from "@/components/filters/color-filter";
import { MaterialFilter } from "@/components/filters/material-filter";
import { fetchCategoryBySlug } from "@/framework/category.ssr";
import { fetchMaterialBySlug } from "@/framework/material.ssr";
import { fetchColorBySlug } from "@/framework/color.ssr";
import { fetchBrandBySlug } from "@/framework/brand.ssr";
import { fetchProducts } from "@/framework/product";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import PageSizeSelector from "@/components/filters/page-size-selector";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { ProductsGrid } from "@/components/products/products-grid";
import { CategoryFilter } from "@/components/filters/category-filter";
import { PriceRangeFilter } from "@/components/filters/price-range-filter";

function MoebelPage({
                        initialCategory,
                        products,
                        page,
                        pageSize,
                        pageCount,
                        total,
                    }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTerms, setSearchTerms] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const debouncedSearch = debounce((terms) => {
        setLoading(true);
        const query = {
            ...router.query,
            search: terms.join(' '),
        };
        router.push({
            pathname: router.pathname,
            query,
        });
    }, 500);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const newSearchTerms = [...searchTerms, searchTerm.trim()];
            setSearchTerms(newSearchTerms);
            setSearchTerm('');
            debouncedSearch(newSearchTerms);
        }
    };

    const handleChipRemove = (term) => {
        const newSearchTerms = searchTerms.filter((t) => t !== term);
        setSearchTerms(newSearchTerms);
        debouncedSearch(newSearchTerms);
    };

    useEffect(() => {
        if (router.query.search) {
            setSearchTerms(router.query.search.split(' '));
        }
        setLoading(false);
    }, [router.query.search, products]);

    return (
        <>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-auto items-center border-b p-6  lg:px-4">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Package2 className="h-6 w-6" />
                                <span className="">{capitalize(initialCategory?.name ?? 'Moebel')}</span>
                            </Link>
                        </div>
                        <div className="flex-1 h-full">
                            <Suspense fallback={<div>Loading...</div>}>
                                <PriceRangeFilter setLoading={setLoading} />
                                <BrandFilter />
                                <CategoryFilter />
                                <ColorFilter />
                                <MaterialFilter />
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <header className="flex h-auto items-center gap-4 border-b bg-muted/40 p-4  lg:px-6">
                        <div className="w-full flex-1">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </form>
                            <div className="flex gap-2 flex-wrap">
                                {searchTerms.map((term) => (
                                    <div
                                        key={term}
                                        className="flex mt-2 items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                                    >
                                        {term}
                                        <button
                                            type="button"
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                            onClick={() => handleChipRemove(term)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
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

                        <Suspense fallback={<div>Loading Breadcrumbs...</div>}>
                            <Breadcrumbs />
                        </Suspense>

                        {loading ? (
                            <div className="flex justify-center items-center">
                                <ArrowPathIcon className="mr-2 h-12 w-12 animate-spin" />
                            </div>
                        ) : (
                            <ProductsGrid products={products} page={page} pageCount={pageCount} />
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps({ params, query }) {
    const filters = { $and: [] };

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

    const filtersToApply = [
        initialMaterial ? { original_material: initialMaterial[0].label } : null,
        initialColor ? { original_color: initialColor[0].label } : null,
        initialBrand ? { brandName: initialBrand[0].label } : null,
    ].filter(Boolean);

    filters.$and.push(...filtersToApply);

    if (query.search) {
        const searchTerms = query.search.split(' ').map((term) => term.trim());
        const searchFilters = searchTerms.map((term) => ({
            $or: [
                { productName: { $contains: term } },
                { description: { $contains: term } },
                { shortDescription: { $contains: term } },
            ],
        }));
        filters.$and.push(...searchFilters);
    }

    if (query.minPrice || query.maxPrice) {
        const minPrice = query.minPrice ? parseInt(query.minPrice) : 0;
        const maxPrice = query.maxPrice ? parseInt(query.maxPrice) : 10000;
        filters.$and.push({
            price: {
                $gte: minPrice,
                $lte: maxPrice,
            },
        });
    }

    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 30;

    const { products, total, pageCount } = await fetchProducts(filters, { page, pageSize }, 'price', 'desc');

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
