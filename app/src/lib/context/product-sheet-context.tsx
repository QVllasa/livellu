import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';

interface ProductSheetContextType {
    isOpen: boolean;
    openSheet: (variantId: string) => void;
    closeSheet: () => void;
    variantId: string | null;
    source: 'url' | 'click'
}

const ProductSheetContext = createContext<ProductSheetContextType | undefined>(undefined);

export const useProductSheet = () => {
    const context = useContext(ProductSheetContext);
    if (!context) {
        throw new Error('useProductSheet must be used within a ProductSheetProvider');
    }
    return context;
};

export const ProductSheetProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [variantId, setVariantId] = useState<string | null>(null);
    const [source, setSource] = useState<string | null>(null);
    const router = useRouter();


    // Automatically open sheet if variantId is present in the URL query
    useEffect(() => {
        const {variantId: queryVariantId} = router.query;

        if (queryVariantId && typeof queryVariantId === 'string' && source != 'click') {
            openSheet(queryVariantId, 'url');
        }
    }, [router.query]);

    // Function to open the sheet and update the URL with variantId
    const openSheet = (variantId: string, source: 'url' | 'click') => {
        setIsOpen(true);
        setVariantId(variantId);
        setSource(source);

        const [path, query] = router.asPath.split('?');
        const pathSegments = router.query.params ? (Array.isArray(router.query.params) ? router.query.params : [router.query.params]) : [];


        console.log("pathSegments: ", pathSegments);

        // Build the base path with current segments
        const basePath = `/${pathSegments.join('/')}`;

        // Update the variantId in query params
        const searchPath = `${path.includes('suche') ? "/suche" : ""}`;
        const updatedQuery = {...router.query, variantId};
        delete updatedQuery.params; // Remove 'params' key if present

        // Construct the new URL path with query
        const newUrl = `${searchPath}${basePath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;

        // Navigate to the updated URL
        router.replace(newUrl, undefined, {  scroll: false });
    };

    // Function to close the sheet and remove variantId from the URL
    const closeSheet = () => {
        setIsOpen(false);
        setVariantId(null);

        // Update the URL with variantId without reloading the page
        const [path, query] = router.asPath.split('?');
        const pathSegments = router.query.params ? (Array.isArray(router.query.params) ? router.query.params : [router.query.params]) : [];

        // Build the base path with current segments
        const basePath = `/${pathSegments.join('/')}`;

        delete router.query.variantId;

        // Update the variantId in query params
        const searchPath = `${path.includes('suche') ? "/suche" : ""}`;
        const updatedQuery = {...router.query};
        delete updatedQuery.params; // Remove 'params' key if present

        // Construct the new URL path with query
        const newUrl = `${searchPath}${basePath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;

        // Navigate to the updated URL
        router.replace(newUrl, undefined, {  scroll: false });
    };


    return (
        <ProductSheetContext.Provider value={{isOpen, openSheet, closeSheet, variantId, source}}>
            {children}
        </ProductSheetContext.Provider>
    );
};
