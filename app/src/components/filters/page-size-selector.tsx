// components/ui/page-size-selector.js
import { useRouter } from "next/router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/components/ui/dropdown-menu";
import { Button } from "@/shadcn/components/ui/button";

const PageSizeSelector = ({ currentSize }) => {
    const router = useRouter();
    const pageSizes = [10, 20, 30, 50, 100];

    const handlePageSizeChange = (size) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, pageSize: size },
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    Anzahl: {currentSize}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {pageSizes.map((size) => (
                    <DropdownMenuItem
                        key={size}
                        onClick={() => handlePageSizeChange(size)}
                        className={currentSize === size ? 'font-bold' : ''}
                    >
                        {size}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PageSizeSelector;
