// components/ui/page-size-selector.js
import {useRouter} from "next/router";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/shadcn/components/ui/dropdown-menu";
import {Button} from "@/shadcn/components/ui/button";

const PageOrderSelector = ({orderBy}) => {
    const router = useRouter();
    const orders = [
        {label: 'Absteigend', value: 'desc'},
        {label: 'Aufsteigend', value: 'asc'}];

    const handleOrderChange = (value) => {
        router.push({
            pathname: router.pathname,
            query: {...router.query, order: value},
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    Sortierung: {orderBy}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {orders.map((value, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={() => handleOrderChange(value.value)}
                        className={orderBy === value.value ? 'font-bold' : ''}
                    >
                        {value.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
    ;

    export default PageOrderSelector;
