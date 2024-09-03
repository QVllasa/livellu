import {useRouter} from "next/router";
import {Slider} from "./price-slider-component";
import {useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/shadcn/components/ui/popover";
import {Button} from "@/shadcn/components/ui/button";

interface PriceRangeFilterProps {
    meta: {
        facetStats: {
            'variants.price'?: {
                min: number;
                max: number;
            };
        };
    };
}

export const PriceRangeFilter = ({ meta }: PriceRangeFilterProps) => {
    const router = useRouter();
    const { minPrice, maxPrice } = router.query;

    const defaultMin = Math.floor(meta?.facetStats?.['variants.price']?.min || 0);
    const defaultMax = Math.ceil(meta?.facetStats?.['variants.price']?.max > 20000 ? 20000 : meta?.facetStats?.['variants.price']?.max || 20000);

    const [priceRange, setPriceRange] = useState([Number(minPrice) || defaultMin, Number(maxPrice) || defaultMax]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setPriceRange([Number(minPrice) || defaultMin, Number(maxPrice) || defaultMax]);
    }, [minPrice, maxPrice, defaultMin, defaultMax]);

    const handlePriceChange = (values: number[]) => {
        setPriceRange(values);

        const pathSegments = router.query.params ? (Array.isArray(router.query.params) ? router.query.params : [router.query.params]) : [];
        const basePath = `/${pathSegments.join('/')}`;

        const updatedQuery = { ...router.query };
        delete updatedQuery.params; // Remove 'params' to keep it in the path

        if (values[0] === defaultMin) {
            delete updatedQuery.minPrice;
        } else {
            updatedQuery.minPrice = values[0].toString();
        }

        if (values[1] === defaultMax) {
            delete updatedQuery.maxPrice;
        } else {
            updatedQuery.maxPrice = values[1].toString();
        }

        // Construct the new URL path with query
        const newUrl = `${basePath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;

        router.replace(newUrl, undefined, { scroll: false });
    };

    return (
        <div className="w-auto">
            <Popover
                className="w-full"
                open={isOpen}
                onOpenChange={(open) => setIsOpen(open)}
            >
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        variant="outline"
                        className={`relative overflow-hidden flex  w-full ${isOpen || (priceRange[0] > defaultMin || priceRange[1] < defaultMax) ? "bg-blue-500 text-white" : ""}`}
                    >
                        <span>Preis</span>
                        {/*{(priceRange[0] > defaultMin || priceRange[1] < defaultMax) && (*/}
                        {/*    <span className="ml-2 text-xs font-thin" suppressHydrationWarning>*/}
                        {/*        {priceRange[0].toLocaleString()}€ - {priceRange[1].toLocaleString()}€*/}
                        {/*    </span>*/}
                        {/*)}*/}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="w-auto p-4 relative">
                        <Slider
                            formatLabel={(value) => `${value.toLocaleString()} €`}
                            min={defaultMin}
                            max={defaultMax}
                            step={10}
                            value={priceRange}
                            onValueChange={handlePriceChange}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
