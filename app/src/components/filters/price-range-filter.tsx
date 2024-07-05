// components/filters/price-range-filter.tsx
import {useRouter} from "next/router";
import {Slider} from "./price-slider-component";
import {useEffect, useState} from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import Client from "@/framework/client";

export const PriceRangeFilter = () => {
    const router = useRouter();
    const {minPrice, maxPrice} = router.query;
    const [openItem, setOpenItem] = useState("item-1");
    const [defaultMin, setDefaultMin] = useState(0);
    const [defaultMax, setDefaultMax] = useState(10000);
    const [priceRange, setPriceRange] = useState([Number(minPrice) || defaultMin, Number(maxPrice) || defaultMax]);

    useEffect(() => {
        const getMinMaxPrice = async () => {
            try {
                const {min, max} = await Client.products.getMinMaxPrice();
                // round min and max to full integers set
                setDefaultMin(Math.floor(min));

                // if max is higher than 20000 than set it to 20000
                setDefaultMax(Math.ceil(max > 20000 ? 20000 : max));
            } catch (error) {
                // round min and max to full integers set
                setDefaultMin(0);

                // if max is higher than 20000 than set it to 20000
                setDefaultMax(20000);
            }


        };
        getMinMaxPrice();
    }, []);

    useEffect(() => {
        setPriceRange([Number(minPrice) || defaultMin, Number(maxPrice) || defaultMax])
    }, [defaultMin, defaultMax]);


    useEffect(() => {
        if (minPrice || maxPrice) {
            setPriceRange([Number(minPrice) || defaultMin, Number(maxPrice) || defaultMax]);
        }
    }, [minPrice, maxPrice]);

    const handlePriceChange = (values: number[]) => {
        setPriceRange(values);
        const query = {...router.query};

        if (values[0] === defaultMin) {
            delete query.minPrice;
        } else {
            query.minPrice = ''+values[0];
        }

        if (values[1] === defaultMax) {
            delete query.maxPrice;
        } else {
            query.maxPrice = ''+values[1];
        }


        router.push({
            pathname: router.pathname,
            query,
        }, undefined, {scroll: false});

    };

    return (
        <div className="w-auto">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-medium">Preis:
                            {(priceRange[0] > defaultMin || priceRange[1] < defaultMax) && (
                                <span className="font-bold ml-2" suppressHydrationWarning>
                                    {priceRange[0].toLocaleString()}€ - {priceRange[1].toLocaleString()}€
                                </span>
                            )}
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
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
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

    )
        ;
};
