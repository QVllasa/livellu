// components/ui/page-size-selector.js
import {useRouter} from "next/router";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/shadcn/components/ui/dropdown-menu";
import {Button} from "@/shadcn/components/ui/button";
import {pageSizeAtom} from "@/store/filters";
import {useEffect, useState} from "react";

const PageSizeSelector = () => {
    const router = useRouter();
    const pageSizes = pageSizeAtom;
    const [pageSize, setPageSize] = useState(48);

    useEffect(() => {
        if (router.query.pageSize) {
            setPageSize(parseInt(router.query.pageSize as string, 10));
        }
    }, [router.query.pageSize]);

    const handlePageSizeChange = (size: number) => {
        const currentPath = router.pathname;
        const pathSegments = router.query.params ? (Array.isArray(router.query.params) ? router.query.params : [router.query.params]) : [];

        // Build the base path with current segments
        const basePath = `/${pathSegments.join('/')}`;

        // Update the pageSize in query params
        const updatedQuery = { ...router.query, pageSize: size.toString() };
        delete updatedQuery.params; // Remove 'params' key if present

        // Construct the new URL path with query
        const newUrl = `${basePath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;

        // Navigate to the updated URL
        router.push(newUrl);
    };


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    Anzahl: {pageSize}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {pageSizes.map((size) => (
                    <DropdownMenuItem
                        key={size}
                        onClick={() => handlePageSizeChange(size)}
                        className={pageSize === size ? 'font-bold' : ''}
                    >
                        {size}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PageSizeSelector;
