import {useRouter} from "next/router";
import ProductCard from "@/components/products/cards/product-card";
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/shadcn/components/ui/pagination";
import {Product} from "@/types";
import {Button} from "@/shadcn/components/ui/button";
import {ReloadIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {fetchProducts} from "@/framework/product";

interface ProductsGridProps {
    initialProducts: Product[];
    initialPage: number;
    pageCount: number;
    initialLoading: boolean;
    initialFilters: any;
}

export const ProductsGrid = ({
                                 initialProducts,
                                 initialPage,
                                 pageCount,
                                 initialLoading,
                                 initialFilters,
                             }: ProductsGridProps) => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState<number>(initialPage);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [autoLoadCount, setAutoLoadCount] = useState<number>(0);
    const [filters, setFilters] = useState<any>(initialFilters);
    const [isLoading, setIsLoading] = useState(false)

    const maxCount = 5;

    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    useEffect(() => {
        setFilters(initialFilters);
    }, [filters]);

    useEffect(() => {
        console.log('Auto load count:', autoLoadCount)
    }, [autoLoadCount]);


    const updatePageQueryParameter = (newPage: number) => {
        console.log("updatePageQueryParameter called ", router.pathname)
        const basePath = router.pathname;
        const pathSegments = router.query.params
            ? Array.isArray(router.query.params)
                ? router.query.params
                : [router.query.params]
            : [];
        const cleanedBasePath = `/${pathSegments.join("/")}`;
        const updatedQuery = { ...router.query, page: newPage };
        delete updatedQuery.params;
        const newUrl = `${cleanedBasePath}${
            Object.keys(updatedQuery).length
                ? `?${new URLSearchParams(updatedQuery).toString()}`
                : ""
        }`;
        router.push(newUrl, undefined, { shallow: true }); // Use shallow routing to update the URL without refreshing
    };

    const loadMoreProducts = (selectedPage: number) => {
        setPage(selectedPage);

        const basePath = router.pathname;
        const pathSegments = router.query.params
            ? Array.isArray(router.query.params)
                ? router.query.params
                : [router.query.params]
            : [];
        const cleanedBasePath = `/${pathSegments.join("/")}`;
        const updatedQuery = { ...router.query, page: selectedPage };
        delete updatedQuery.params;
        const newUrl = `${cleanedBasePath}${
            Object.keys(updatedQuery).length
                ? `?${new URLSearchParams(updatedQuery).toString()}`
                : ""
        }`;
        router.push(newUrl);
    };

    const loadMoreProductsMobile = async () => {
        if (loadingMore || page >= pageCount) return;

        setLoadingMore(true);

        try {
            const nextPage = page + 1;
            const updatedFilters = { ...filters, page: nextPage };
            const { data } = await fetchProducts(updatedFilters);
            setProducts((prevProducts) => [...prevProducts, ...data]);
            setPage(nextPage);
            updatePageQueryParameter(nextPage);

            if (autoLoadCount >= maxCount) {
                // Update the URL with the new page parameter
                setAutoLoadCount(0);
            }else {
                setAutoLoadCount((count) => count + 1);
            }

            // Update the URL with the new page parameter
            updatePageQueryParameter(nextPage);
        } catch (error) {
            console.error("Error loading more products:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Handle scroll events to load more products when the user scrolls past 30% of the viewport height
    useEffect(() => {
        const handleScroll = () => {
            if (autoLoadCount >= maxCount || loadingMore) return; // Exit if auto-load limit is reached or already loading

            const scrollTop = window.scrollY || window.pageYOffset; // Get current scroll position
            const windowHeight = window.innerHeight; // Get the height of the viewport
            const documentHeight = document.body.scrollHeight; // Get the total height of the document

            const triggerPoint = documentHeight * 0.3; // Calculate 30% of the total document height

            // Check if scrolled past 30% of the viewport
            if (scrollTop + windowHeight >= triggerPoint) {
                loadMoreProductsMobile();
            }
        };

        const isMobile = window.innerWidth < 768; // Check if the device is mobile

        if (isMobile) {
            window.addEventListener("scroll", handleScroll); // Attach the scroll event listener
        }

        return () => {
            if (isMobile) {
                window.removeEventListener("scroll", handleScroll); // Clean up the event listener on unmount
            }
        };
    }, [autoLoadCount, loadingMore, page, pageCount]);


    const hasFetchedInitialProducts = useRef(false); // Add this line

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const queryPage = parseInt(router.query.page as string) || 1;

        // Ensure this runs only on the initial load for mobile devices
        if (isMobile && queryPage > 1 && !hasFetchedInitialProducts.current) {
            hasFetchedInitialProducts.current = true; // Mark as fetched
            setLoadingMore(true);

            const loadInitialProducts = async () => {
                setIsLoading(true)
                try {
                    // Calculate the total number of products to load
                    const totalProducts = queryPage * filters.pageSize;

                    // Update filters to fetch all products in one go
                    const updatedFilters = {
                        ...filters,
                        page: 1, // Start from the first page
                        pageSize: totalProducts, // Fetch all products up to the specified page
                    };

                    const { data } = await fetchProducts(updatedFilters);

                    setProducts(data);
                    setPage(queryPage);
                    setAutoLoadCount(queryPage - 1);
                } catch (error) {
                    console.error("Error loading initial products:", error);
                } finally {
                    setLoadingMore(false);
                    setIsLoading(false)
                }
            };

            loadInitialProducts();
        }
    }, []); // Empty dependency array to ensure it runs only on initial load

    const renderPageLinks = () => {
        const maxPagesToShow = 5;
        const pages = [];

        if (pageCount <= maxPagesToShow) {
            for (let i = 1; i <= pageCount; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={page === i}
                            onClick={(e) => {
                                e.preventDefault();
                                loadMoreProducts(i);
                            }}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            let startPage = Math.max(1, page - 2);
            let endPage = Math.min(pageCount, page + 2);

            if (startPage > 1) {
                pages.push(
                    <PaginationItem key={1}>
                        <PaginationLink
                            href="#"
                            isActive={page === 1}
                            onClick={(e) => {
                                e.preventDefault();
                                loadMoreProducts(1);
                            }}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                );

                if (startPage > 2) {
                    pages.push(<PaginationEllipsis key="start-ellipsis" />);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={page === i}
                            onClick={(e) => {
                                e.preventDefault();
                                loadMoreProducts(i);
                            }}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (endPage < pageCount) {
                if (endPage < pageCount - 1) {
                    pages.push(<PaginationEllipsis key="end-ellipsis" />);
                }

                pages.push(
                    <PaginationItem key={pageCount}>
                        <PaginationLink
                            href="#"
                            isActive={page === pageCount}
                            onClick={(e) => {
                                e.preventDefault();
                                loadMoreProducts(pageCount);
                            }}
                        >
                            {pageCount}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        return pages;
    };

    return (
        <>
            {products.length === 0 ? (
                <NoProductsFound />
            ) : (
                <div className="w-full flex flex-col items-center" ref={gridRef}>
                    <div className="w-full mx-auto p-0">
                        {/* Display search terms if they exist */}
                        {isLoading ? <div>Loading...</div> : <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-1 sm:gap-4 py-4">
                            {products.map((product, index) => (
                                <ProductCard key={index} product={product}/>
                            ))}
                        </div> }

                    </div>

                    {/* Desktop Pagination */}
                    <div className="w-full max-w-7xl mx-auto mt-4 px-2 overflow-hidden hidden sm:block">
                        <Pagination>
                            <PaginationContent className="flex justify-center items-center">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page > 1) loadMoreProducts(page - 1);
                                        }}
                                    />
                                </PaginationItem>
                                {renderPageLinks()}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page < pageCount) loadMoreProducts(page + 1);
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>

                    {/* Mobile "Load More" Button */}
                    {autoLoadCount >= 4 && (
                        <div className="block sm:hidden mt-4">
                            <Button
                                className={'text-white bg-blue-500'}
                                onClick={loadMoreProductsMobile}
                                disabled={page >= pageCount || loadingMore}
                            >
                                {loadingMore ? (
                                    <>
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        Laden...
                                    </>
                                ) : page < pageCount ? (
                                    "Mehr laden"
                                ) : (
                                    "Keine weiteren Produkte"
                                )}
                            </Button>
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
