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
        const query = { ...router.query };

        if (values[0] === defaultMin) {
            delete query.minPrice;
        } else {
            query.minPrice = '' + values[0];
        }

        if (values[1] === defaultMax) {
            delete query.maxPrice;
        } else {
            query.maxPrice = '' + values[1];
        }

        router.replace({
            pathname: router.pathname,
            query,
        }, undefined, { scroll: false });
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
                        className={`flex justify-between w-full ${isOpen || (priceRange[0] > defaultMin || priceRange[1] < defaultMax) ? "bg-blue-500 text-white" : ""}`}
                    >
                        <span>Preis</span>
                        {(priceRange[0] > defaultMin || priceRange[1] < defaultMax) && (
                            <span className="ml-2 text-xs font-bold" suppressHydrationWarning>
                                {priceRange[0].toLocaleString()}€ - {priceRange[1].toLocaleString()}€
                            </span>
                        )}
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
