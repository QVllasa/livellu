import {useRouter} from "next/router";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/shadcn/components/ui/dropdown-menu";
import {Button} from "@/shadcn/components/ui/button";
import {sortsAtom} from "@/store/filters";
import {Key, useEffect, useState} from "react";
import {Sort} from "@/types";

const PageSortSelector = () => {
    const router = useRouter();
    const sorts = sortsAtom;
    const [sort, setSort] = useState<Sort | undefined>(undefined);

    useEffect(() => {
        if (router.query.sort) {
            setSort(sorts?.find((el: Sort) => el?.id === router.query.sort));
        }
    }, [router.query.sort]);

    const handleSortChange = (id: any) => {
        // Extract the current path segments from the router query
        const pathSegments = router.query.params ? (Array.isArray(router.query.params) ? router.query.params : [router.query.params]) : [];
        const basePath = `/${pathSegments.join('/')}`;

        // Clone the current query parameters
        const updatedQuery = { ...router.query };
        delete updatedQuery.params; // Remove 'params' to keep it in the path

        // Update or add the 'sort' parameter
        updatedQuery.sort = id;

        // Construct the new URL path with query
        const newUrl = `${basePath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;

        // Navigate to the updated URL
        router.push(newUrl);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    Sortierung: {sort?.label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {sorts.map((value: Sort, index: Key | null | undefined) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={() => handleSortChange(value.id)}
                        className={sort?.value === value.value ? 'font-bold' : ''}
                    >
                        {value.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PageSortSelector;
