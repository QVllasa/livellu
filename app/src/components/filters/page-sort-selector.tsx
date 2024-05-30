// components/ui/page-size-selector.js
import {useRouter} from "next/router";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/shadcn/components/ui/dropdown-menu";
import {Button} from "@/shadcn/components/ui/button";
import {useAtom} from "jotai";
import {sortsAtom} from "@/store/filters";

const PageSortSelector = ({sort}) => {
    const router = useRouter();
    const sorts = sortsAtom

    const handleSortChange = (value) => {
        router.push({
            pathname: router.pathname,
            query: {...router.query, sort: value},
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    Sortierung: {sort.label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {sorts.map((value, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={() => handleSortChange(value.value)}
                        className={sort.value === value.value ? 'font-bold' : ''}
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
