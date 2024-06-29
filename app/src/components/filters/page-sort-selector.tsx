// components/ui/page-size-selector.js
import {useRouter} from "next/router";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/shadcn/components/ui/dropdown-menu";
import {Button} from "@/shadcn/components/ui/button";
import {sortsAtom} from "@/store/filters";
import {Key, useEffect, useState} from "react";
import {Sort} from "@/types";

const PageSortSelector = () => {
    const router = useRouter();
    const sorts = sortsAtom
    const [sort, setSort] = useState<Sort | undefined>(undefined)

    useEffect(() => {
        if (router.query.sort) {
            setSort(sorts?.find((el: Sort) => el?.id === router.query.sort))
        }
    }, [router.query.sort]);

    const handleSortChange = (id: any) => {
        router.push({
            pathname: router.pathname,
            query: {...router.query, sort: id},
        });
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
    }
;

export default PageSortSelector;
