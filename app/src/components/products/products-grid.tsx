import {useRouter} from "next/router";
import ProductCard from "@/components/products/cards/product-card";
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/shadcn/components/ui/pagination";
import {Product} from "@/types";
import {Button} from "@/shadcn/components/ui/button";
import {ReloadIcon} from "@radix-ui/react-icons";
import Link from "next/link";

interface ProductsGridProps {
    products: Product[];
    page: number;
    pageCount: number;
    loading: boolean;
}

export const ProductsGrid = ({ products, page, pageCount, loading }: ProductsGridProps) => {
    const router = useRouter();

    // Check for search terms in the query
    const searchTerms = router.query.search ? router.query.search.split(' ') : [];


    const loadMoreProducts = (selectedPage: number) => {
        // Get the base path without query parameters
        const basePath = router.pathname;

        // Get current params from the URL
        const pathSegments = router.query.params
            ? (Array.isArray(router.query.params) ? router.query.params : [router.query.params])
            : [];

        // Build the base path with current segments
        const cleanedBasePath = `/${pathSegments.join('/')}`;

        // Create a new query object excluding 'params' if it's present
        const updatedQuery = { ...router.query, page: selectedPage };
        delete updatedQuery.params;

        // Manually construct the new URL path with query
        const newUrl = `${cleanedBasePath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;

        // Use router.push to navigate to the constructed URL
        router.push(newUrl);
    };

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
                <div className="w-full flex flex-col items-center">
                    <div className="w-full mx-auto p-0 ">
                        {/* Display search terms if they exist */}
                        {searchTerms.length > 0 && (
                            <div className="w-full  mx-auto py-4">
                                <h2 className="text-lg font-semibold">
                                    Suchergebnisse für: "{searchTerms.join(' ')}"
                                </h2>
                            </div>
                        )}
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-1 sm:gap-4 py-4">
                            {products.map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                        </div>
                    </div>

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

                    <div className="block sm:hidden mt-4">
                        <Button onClick={() => loadMoreProducts(page + 1)} disabled={page >= pageCount || loading}>
                            {loading ? (
                                <>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Laden...
                                </>
                            ) : page < pageCount ? "Mehr laden" : "Keine weiteren Produkte"}
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

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
