// components/ui/page-size-selector.js
import {useRouter} from "next/router";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/shadcn/components/ui/dropdown-menu";
import {Button} from "@/shadcn/components/ui/button";
import {pageSizeAtom} from "@/store/filters";
import {useEffect, useState} from "react";

const PageSizeSelector = () => {
    const router = useRouter();
    const pageSizes = pageSizeAtom;
    const [pageSize, setPageSize] = useState(48)

    useEffect(() => {
            if (router.query.pageSize) {
                setPageSize(parseInt(router.query.pageSize as string, 10));
            }
        }
        , [router.query.pageSize]);

    const handlePageSizeChange = (size: number) => {
        router.push({
            pathname: router.pathname,
            query: {...router.query, pageSize: size},
        });
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
