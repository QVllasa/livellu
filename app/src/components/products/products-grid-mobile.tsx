import {useRouter} from "next/router";
import ProductCard from "@/components/products/cards/product-card";
import {Product} from "@/types";
import {ReloadIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {useState} from "react";
import {fetchProducts} from "@/framework/product";
import InfiniteScroll from 'react-infinite-scroll-component';

interface ProductsGridProps {
    initialProducts: Product[];
    initialPage: number;
    pageCount: number;
    initialLoading: boolean;
    initialFilters: any;
}

export const ProductsGridMobile = ({
                                       initialProducts,
                                       initialPage,
                                       pageCount,
                                       initialLoading,
                                       initialFilters,
                                   }: ProductsGridProps) => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [page, setPage] = useState<number>(initialPage);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [filters, setFilters] = useState<any>(initialFilters);

    // Fetch the next page of products when needed
    const loadMoreProducts = async () => {
        if (loadingMore || page >= pageCount) return;

        setLoadingMore(true);

        try {
            const nextPage = page + 1;
            const updatedFilters = { ...filters, page: nextPage };
            const { data } = await fetchProducts(updatedFilters);

            // Append new products to the existing list
            setProducts((prevProducts) => [...prevProducts, ...data]);
            setPage(nextPage);
            updatePageQueryParameter(nextPage);

            if (nextPage >= pageCount) {
                setHasMore(false); // Stop infinite scrolling when reaching the last page
            }
        } catch (error) {
            console.error("Error loading more products:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Update the page query parameter in the URL without reloading the page
    const updatePageQueryParameter = (newPage: number) => {
        const [path, queryString] = router.asPath.split('?');
        const segments = path.split('/').filter(seg => seg !== '');

        const basePath = router.pathname;
        const pathSegments = router.query.params
            ? Array.isArray(router.query.params)
                ? router.query.params
                : [router.query.params]
            : segments;

        const cleanedBasePath = `${path.includes('suche') ? "/suche" : ""}/${pathSegments.join("/")}`;




        const updatedQuery = { ...router.query, page: newPage };
        delete updatedQuery.params;

        const newUrl = `${cleanedBasePath}${
            Object.keys(updatedQuery).length
                ? `?${new URLSearchParams(updatedQuery).toString()}`
                : ""
        }`;

        router.push(newUrl, undefined, { shallow: true });
    };

    return (
        <>
            {products.length === 0 ? (
                <NoProductsFound />
            ) : (
                <div className="w-full flex flex-col items-center">
                    <div className="w-full mx-auto p-0">
                        {/* Display products using InfiniteScroll */}
                        <InfiniteScroll
                            dataLength={products.length}
                            next={loadMoreProducts}
                            hasMore={hasMore}
                            loader={
                                <div className="text-center">
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Laden...
                                </div>
                            }
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                    <b>Keine weiteren Produkte</b>
                                </p>
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
