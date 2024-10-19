import {useRouter} from "next/router";
import ProductCard from "@/components/products/cards/product-card";
import {Merchant, MetaData, Product} from "@/types";
import {Button} from "@/shadcn/components/ui/button";
import {ReloadIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {useEffect, useState} from "react";
import {fetchProducts} from "@/framework/product";
import {useProductSheet} from "@/lib/context/product-sheet-context";
import InfiniteScroll from "react-infinite-scroll-component";

interface ProductsGridProps {
    initialProducts: Product[];
    initialPage: number;
    pageCount: number;
    initialFilters: any;
    merchant: Merchant;
    meta: MetaData;
}

export default function ProductsGridMobile ({
                                       initialProducts,
                                        merchant,
                                       initialPage,
                                       pageCount,
                                       initialFilters,
                                       meta,
                                   }: ProductsGridProps)  {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [page, setPage] = useState<number>(initialPage);
    const [filters, setFilters] = useState<any>(initialFilters);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [autoLoadCount, setAutoLoadCount] = useState<number>(0);
    const {isOpen} = useProductSheet();



    // total products count in the database
    const {total} = meta;

    const maxCount = 4;
    const productLimit = 192; // Threshold to show the "Load More" button after each 192 products

    useEffect(() => {
        const queryPage = parseInt(router.query.page as string) || initialPage;
        setPage(queryPage);
    }, [router.query.page, initialPage]);

    // Update the page query parameter in the URL without reloading the page
    const updatePageQueryParameter = (newPage: number) => {
        const currentUrl = router.asPath;

        // Use a regex to find and replace the page parameter in the query string
        const newUrl = currentUrl.includes("page=")
            ? currentUrl.replace(/page=\d+/, `page=${newPage}`)  // Replace existing page parameter
            : currentUrl.includes("?")  // If there are already query parameters
                ? `${currentUrl}&page=${newPage}`  // Add page parameter if there are existing params
                : `${currentUrl}?page=${newPage}`; // Add page if there are no existing params


        router.push(newUrl, undefined, { shallow: true });
    };


    // Function for initial load (triggered on mount)
    const initialLoadProducts = async () => {
        if (loadingMore || isOpen) return; // Avoid loading more if it's already loading or drawer is open

        setLoadingMore(true);
        try {
             const updatedFilters = {...filters, page: 1, pageSize: page * filters.pageSize}; // Do not change page count here
            const {data} = await fetchProducts(updatedFilters);
             let filteredData = []
             if (merchant) {
                filteredData = data.map(product => {
                    return {
                        ...product,
                        variants: product.variants.filter(variant => variant.merchantId === merchant.merchantId)
                    };
                });
            }else{
                filteredData = data
            }

            // Replace products in the list (don't increment page)
            setProducts(filteredData);
        } catch (error) {
            console.error("Error loading initial products:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Function for infinite scroll loading
    const loadMoreProductsOnScroll = async () => {
        if (loadingMore || page >= pageCount || isOpen) return;

        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const updatedFilters = {...filters, pageSize: nextPage * filters.pageSize}; // Load next batch


            const {data} = await fetchProducts(updatedFilters);
            let filteredData = []
            if (merchant) {
                filteredData = data.map(product => {
                    return {
                        ...product,
                        variants: product.variants.filter(variant => variant.merchantId === merchant.merchantId)
                    };
                });
            }else{
                filteredData = data
            }

            // Replace products in the list (don't increment page)
            setProducts(filteredData);
            setPage(nextPage);

            // Update page in URL
            updatePageQueryParameter(nextPage);

            if (filters.pageSize >= productLimit) {
                setAutoLoadCount(0);
            } else if (autoLoadCount >= maxCount) {
                setAutoLoadCount(0);
            } else {
                setAutoLoadCount((count) => count + 1);
            }
        } catch (error) {
            console.error("Error loading more products:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    useEffect(() => {
        (async () => {
            await initialLoadProducts();
        })();
    }, [filters]);

    return (
        <>
            {products.length === 0 ? (
                <NoProductsFound/>
            ) : (
                <div className="w-full flex flex-col items-center">
                    <div className="w-full mx-auto p-0">
                        {/* Infinite Scroll Component */}
                        <InfiniteScroll
                            dataLength={products.length}
                            scrollThreshold={0.5}
                            next={loadMoreProductsOnScroll} // Trigger load more on scroll
                            hasMore={products.length < total && products.length % productLimit !== 0}
                            loader={
                                <div className="text-center">
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                    Laden...
                                </div>
                            }
                            endMessage={
                                <div className="flex justify-center mt-4">
                                    <Button
                                        className={'text-white bg-blue-500'}
                                        onClick={loadMoreProductsOnScroll}
                                        disabled={page >= pageCount || loadingMore}
                                    >
                                        {loadingMore ? (
                                            <>
                                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                                Laden...
                                            </>
                                        ) : page < pageCount ? (
                                            "Mehr laden"
                                        ) : (
                                            "Keine weiteren Produkte"
                                        )}
                                    </Button>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-1 sm:gap-4 py-4">
                                {products.map((product, index) => (
                                    <ProductCard key={index} product={product}/>
                                ))}
                            </div>
                        </InfiniteScroll>
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
            Versuchen Sie, Ihre Filtereinstellungen anzupassen oder suchen Sie nach anderen Produkten.
        </p>
        <Link href="/">
            <span className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Zur Startseite
            </span>
        </Link>
    </div>
);
