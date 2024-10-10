import {useRouter} from "next/router";
import ProductCard from "@/components/products/cards/product-card";
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "@/shadcn/components/ui/pagination";
import {Product} from "@/types";
import Link from "next/link";
import {useEffect, useState} from "react";

interface ProductsGridProps {
    initialProducts: Product[];
    initialPage: number;
    pageCount: number;
    initialLoading: boolean;
    initialFilters: any;
}

export const ProductsGridDesktop = ({
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

    useEffect(() => {
        const queryPage = parseInt(router.query.page as string) || 1;
        setPage(queryPage);
    }, [router.query.page]);


    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    useEffect(() => {
        setFilters(initialFilters);
    }, [filters]);



    const loadMoreProducts = (selectedPage: number) => {
        setPage(selectedPage);

        const [path, queryString] = router.asPath.split('?');
        const segments = path.split('/').filter(seg => seg !== '');

        const basePath = router.pathname;
        const pathSegments = router.query.params
            ? Array.isArray(router.query.params)
                ? router.query.params
                : [router.query.params]
            : segments;

        const cleanedBasePath = `${path.includes('suche') ? "/suche" : ''}/${pathSegments.join("/")}`.replace(/\/suche\/suche/, "/suche");

        const updatedQuery = { ...router.query, page: selectedPage };
        delete updatedQuery.params;
        const newUrl = `${cleanedBasePath}${
            Object.keys(updatedQuery).length
                ? `?${new URLSearchParams(updatedQuery).toString()}`
                : ""
        }`;
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
