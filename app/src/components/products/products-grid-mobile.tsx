import {useRouter} from "next/router";
import ProductCard from "@/components/products/cards/product-card";
import {Product} from "@/types";
import {Button} from "@/shadcn/components/ui/button";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useCallback, useEffect, useState} from "react";
import {fetchProducts} from "@/framework/product";
import {useProductSheet} from "@/lib/context/product-sheet-context";
import Link from "next/link";

interface ProductsGridProps {
    initialProducts: Product[];
    initialPage: number;
    pageCount: number;
    initialFilters: any;
}

export const ProductsGridMobile = ({
                                       initialProducts,
                                       initialPage,
                                       pageCount,
                                       initialFilters,
                                   }: ProductsGridProps) => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [page, setPage] = useState<number>(initialPage);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [filters, setFilters] = useState<any>(initialFilters);
    const [showLoadMore, setShowLoadMore] = useState<boolean>(false); // Toggle for "Load More" button
    const { isOpen } = useProductSheet();

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);


    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    // Update page query parameter in the URL
    const updatePageQueryParameter = (newPage: number) => {
        const [path] = router.asPath.split('?');
        const segments = path.split('/').filter(seg => seg !== '');
        const pathSegments = router.query.params
            ? Array.isArray(router.query.params)
                ? router.query.params
                : [router.query.params]
            : segments;

        const cleanedBasePath = `${path.includes('suche') ? "/suche" : ""}/${pathSegments.join("/")}`.replace(/\/suche\/suche/, "/suche");
        const updatedQuery = { ...router.query, page: newPage };
        delete updatedQuery.params;

        const newUrl = `${cleanedBasePath}${
            Object.keys(updatedQuery).length
                ? `?${new URLSearchParams(updatedQuery).toString()}`
                : ""
        }`;

        router.replace(newUrl, undefined, { shallow: true, scroll: false });
    };

    // Fetch products based on page and filters
    const fetchMoreProducts = async () => {
        if (loadingMore || page >= pageCount || isOpen) return;

        setLoadingMore(true);

        try {
            const nextPage = page + 1;
            const updatedFilters = { ...filters, page: nextPage };
            const { data } = await fetchProducts(updatedFilters);

            setProducts((prevProducts) => [...prevProducts, ...data]);
            setPage(nextPage);
            updatePageQueryParameter(nextPage);

            // If the next page is a multiple of 5, show the "Load More" button
            if (nextPage % 5 === 0) {
                setShowLoadMore(true);
            }
        } catch (error) {
            console.error("Error loading more products:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Handle "Load More" button click
    const handleLoadMoreClick = () => {
        setShowLoadMore(false); // Hide button after clicking
        fetchMoreProducts(); // Load next page
    };

    // Call the function to fetch more products when the user scrolls near the bottom
    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY || window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        const triggerPoint = documentHeight * 0.75;

        if (scrollTop + windowHeight >= triggerPoint && !showLoadMore && !isOpen) {
            fetchMoreProducts();
        }
    }, [page, filters, showLoadMore, isOpen]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <>
            {products.length === 0 ? (
                <NoProductsFound />
            ) : (
                <div className="w-full flex flex-col items-center">
                    <div className="w-full mx-auto p-0">
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-1 sm:gap-4 py-4">
                            {products.map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                        </div>
                    </div>

                    {/* Show "Load More" button after 5 pages */}
                    {showLoadMore && (
                        <div className="mt-4">
                            <Button
                                className={'text-white bg-blue-500'}
                                onClick={handleLoadMoreClick}
                                disabled={loadingMore}
                            >
                                {loadingMore ? (
                                    <>
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        Laden...
                                    </>
                                ) : (
                                    "Mehr laden"
                                )}
                            </Button>
                        </div>
                    )}

                    {loadingMore && (
                        <div className="text-center">
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Laden...
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

const NoProductsFound = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h1 className="text-2xl font-bold mt-6">Keine Produkte gefunden</h1>
        <p className="mt-2 text-gray-600">
            Versuchen Sie, Ihre Filtereinstellungen anzupassen oder suchen Sie nach
            anderen Produkten.
        </p>
        <Link href="/">
            <span className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Zur Startseite
            </span>
        </Link>
    </div>
);
