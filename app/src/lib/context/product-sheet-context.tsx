import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Product} from '@/types';
import {fetchProducts} from '@/framework/product';
import Client from '@/framework/client';

interface ProductSheetContextType {
    isOpen: boolean;
    openSheet: (product: Product, variantId: string) => void;
    closeSheet: () => void;
    activeProduct: Product | null;
    variantId: string | null;
    loading: boolean;
    merchants: any[];
    otherProducts: any[];
    activateAnimation: boolean;
}

const ProductSheetContext = createContext<ProductSheetContextType | undefined>(undefined);

export const useProductSheet = () => {
    const context = useContext(ProductSheetContext);
    if (!context) {
        throw new Error('useProductSheet must be used within a ProductSheetProvider');
    }
    return context;
};

export const ProductSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [variantId, setVariantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [merchants, setMerchants] = useState<any[]>([]);
    const [otherProducts, setOtherProducts] = useState<any[]>([]);
    const [activateAnimation, setActivateAnimation] = useState(true);
    const router = useRouter();

    // Fetch the product data if not in the context and variantId exists
    useEffect(() => {
        const { variantId: urlVariantId } = router.query;

        if (!activeProduct && urlVariantId && typeof urlVariantId === 'string') {
            fetchProductByVariantId(urlVariantId);
            setActivateAnimation(false); // Disable animation on URL load
        }
    }, [router.query.variantId]);

    const fetchProductByVariantId = async (selectedVariantId: string) => {
        setLoading(true);
        try {
            const filters = {
                filter: `variants.variantId = ${selectedVariantId}`,
            };

            const { data: productData } = await fetchProducts(filters);
            if (productData.length > 0) {
                const fetchedProduct = productData[0];
                setActiveProduct(fetchedProduct);

                // Fetch merchants based on the variant's merchant IDs
                const merchantIds = fetchedProduct.variants.map((v: any) => v.merchantId);
                const merchantsFilter = {
                    populate: 'logo_image',
                    filters: { merchantId: { $in: merchantIds } },
                };
                const fetchedMerchants = await Client.merchants.all(merchantsFilter);
                setMerchants(fetchedMerchants.data);

                // Fetch similar products
                const otherProductsFilters = {
                    minPrice: 200,
                    maxPrice: 2000,
                    pageSize: 24,
                    randomize: true,
                };
                const { data: fetchedOtherProducts } = await fetchProducts(otherProductsFilters);
                setOtherProducts(fetchedOtherProducts);

                openSheet(fetchedProduct, selectedVariantId);
            } else {
                console.error('No product found for variantId:', selectedVariantId);
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to open the sheet and update the URL with variantId
    const openSheet = (product: Product, variantId: string) => {
        setIsOpen(true);
        setActiveProduct(product);
        setVariantId(variantId);
        setActivateAnimation(true); // Enable animation on button click

        const [path, query] = router.asPath.split('?');
        const pathSegments = router.query.params
            ? Array.isArray(router.query.params)
                ? router.query.params
                : [router.query.params]
            : [];

        // Build the base path with current segments
        const basePath = `/${pathSegments.join('/')}`;

        // Update the variantId in query params
        const searchPath = `${path.includes('suche') ? '/suche' : ''}`;
        const updatedQuery = { ...router.query, variantId };
        delete updatedQuery.params; // Remove 'params' key if present

        // Construct the new URL path with query
        const newUrl = `${searchPath}${basePath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;

        // Navigate to the updated URL
        router.replace(newUrl, undefined, { scroll: false });
    };

    // Function to close the sheet and remove variantId from the URL
    const closeSheet = () => {
        setIsOpen(false);
        setActiveProduct(null);
        setVariantId(null);

        const [path, query] = router.asPath.split('?');
        const pathSegments = router.query.params
            ? Array.isArray(router.query.params)
                ? router.query.params
                : [router.query.params]
            : [];

        // Build the base path with current segments
        const basePath = `/${pathSegments.join('/')}`;

        delete router.query.variantId;

        // Update the variantId in query params
        const searchPath = `${path.includes('suche') ? '/suche' : ''}`;
        const updatedQuery = { ...router.query };
        delete updatedQuery.params; // Remove 'params' key if present

        // Construct the new URL path with query
        const newUrl = `${searchPath}${basePath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;

        // Navigate to the updated URL
        router.replace(newUrl, undefined, { shallow: true,scroll: false });
    };

    return (
        <ProductSheetContext.Provider
            value={{
                isOpen,
                openSheet,
                closeSheet,
                activeProduct,
                variantId,
                loading,
                merchants,
                otherProducts,
                activateAnimation, // Added animation state here
            }}
        >
            {children}
        </ProductSheetContext.Provider>
    );
};
