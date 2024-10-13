import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Slider} from "./mobile-price-slider-component";
import {Button} from "@/shadcn/components/ui/button";
import {ChevronRight} from "lucide-react";

import dynamic from 'next/dynamic';

const Drawer = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.Drawer), { ssr: false });
const DrawerClose = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerClose), { ssr: false });
const DrawerTrigger = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerTrigger), { ssr: false });
const DrawerTitle = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerTitle), { ssr: false });
const DrawerHeader = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerHeader), { ssr: false });
const DrawerFooter = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerFooter), { ssr: false });
const DrawerContent = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerContent), { ssr: false });


interface PriceRangeFilterProps {
    meta: {
        facetStats: {
            'variants.price'?: {
                min: number;
                max: number;
            };
        };
    };
    type: 'single' | 'multi';
}

export default function MobilePriceRangeFilter  ({meta, type}: PriceRangeFilterProps) {
    const router = useRouter();
    const {minPrice, maxPrice} = router.query;

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

        const updatedQuery = {...router.query};
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

        router.replace(newUrl, undefined, {scroll: false});
    };

    const resetPriceRange = () => {
        handlePriceChange([defaultMin, defaultMax]); // Reset to default range
        setIsOpen(false); // Close the drawer after resetting
    };

    return (
        <div className="w-auto">
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    {type === 'single' ?
                        <Button
                            size="sm"
                            variant="outline"
                            className={`flex w-full ${isOpen || (priceRange[0] > defaultMin || priceRange[1] < defaultMax) ? "bg-blue-500 text-white" : ""}`}
                        >
                            <span>Preis</span>
                        </Button>
                        :
                        <Button size="sm" variant="outline" className={`flex w-full justify-between ${isOpen || (priceRange[0] > defaultMin || priceRange[1] < defaultMax) ? "bg-blue-500 text-white" : ""}`}>
                            <span>Preis</span>
                            <ChevronRight className={'w-4 h-4 ml-auto'}/>
                        </Button>
                    }
                </DrawerTrigger>
                <DrawerContent className="h-3/4">
                    <div className="h-full relative flex flex-col py-1">
                        <DrawerHeader>
                            <DrawerTitle>Preisbereich: {priceRange[0].toLocaleString()}€ - {priceRange[1].toLocaleString()}€</DrawerTitle>
                        </DrawerHeader>
                        <div className="w-auto p-4 relative flex-grow">
                            <Slider
                                formatLabel={(value) => `${value.toLocaleString()} €`}
                                min={defaultMin}
                                max={defaultMax}
                                step={10}
                                value={priceRange}
                                onValueChange={handlePriceChange}
                            />
                        </div>
                        <DrawerFooter className="flex justify-between">
                            <DrawerClose asChild>
                                <Button variant="outline">Schließen</Button>
                            </DrawerClose>
                            <Button variant="link" onClick={resetPriceRange}>Zurücksetzen</Button>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
