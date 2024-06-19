// components/filters/price-range-filter.tsx
import { useRouter } from "next/router";
import { Slider } from "./price-slider-component";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";

export const PriceRangeFilter = () => {
    const router = useRouter();
    const { minPrice, maxPrice } = router.query;
    const [priceRange, setPriceRange] = useState([Number(minPrice) || 0, Number(maxPrice) || 10000]);
    const [openItem, setOpenItem] = useState("item-1");

    useEffect(() => {
        if (minPrice || maxPrice) {
            setPriceRange([Number(minPrice) || 0, Number(maxPrice) || 10000]);
        }
    }, [minPrice, maxPrice]);

    const updatePriceInURL = useCallback(
        debounce((values: number[]) => {
            const query = { ...router.query };

            if (values[0] === 0) {
                delete query.minPrice;
            } else {
                query.minPrice = values[0];
            }

            if (values[1] === 10000) {
                delete query.maxPrice;
            } else {
                query.maxPrice = values[1];
            }


            router.push({
                pathname: router.pathname,
                query,
            }, undefined, { scroll: false });
        }, 750),
        [router]
    );

    const handlePriceChange = (values: number[]) => {
        setPriceRange(values);
        updatePriceInURL(values);
    };

    return (
        <div className="w-64 p-4 relative">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-medium">Preis:
                            {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                                <span className="font-bold ml-2">
                                    {priceRange[0]}€ - {priceRange[1]}€
                                </span>
                            )}
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="w-auto p-4 relative">
                            <Slider
                                formatLabel={(value) => `${value} €`}
                                min={0}
                                max={10000}
                                step={10}
                                value={priceRange}
                                onValueChange={handlePriceChange}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

    )
        ;
};
