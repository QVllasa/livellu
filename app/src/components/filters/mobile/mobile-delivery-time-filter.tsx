import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {ChevronRight} from "lucide-react";
import {unslugify} from "@/lib/utils"; // Import ChevronRight for a uniform look
import dynamic from 'next/dynamic';

const Drawer = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.Drawer), { ssr: false });
const DrawerClose = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerClose), { ssr: false });
const DrawerTrigger = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerTrigger), { ssr: false });
const DrawerTitle = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerTitle), { ssr: false });
const DrawerHeader = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerHeader), { ssr: false });
const DrawerFooter = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerFooter), { ssr: false });
const DrawerContent = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerContent), { ssr: false });

// Define the structure of the filter items
export interface DeliveryTimeItem {
    label: string;
    count: number;
}


interface DeliveryTimeFilterProps {
    meta: {
        facetDistribution: {
            'variants.deliveryTimes'?: Record<string, number>;
        };
    };
    type: 'single' | 'multi';
}

export default function  MobileDeliveryTimeFilter ({ meta, type }: DeliveryTimeFilterProps)  {
    const [currentDeliveryTimes, setCurrentDeliveryTimes] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Initialize current delivery times based on URL
    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const deliverySegment = pathSegments.find(segment => segment.startsWith('lieferzeit:'));

        if (!deliverySegment) {
            setCurrentDeliveryTimes([]);
            return;
        }

        const deliverySlugs = deliverySegment.replace('lieferzeit:', '').split('.');
        const selectedDeliveryTimes = deliverySlugs.map(slug => ({ label: slug }));
        setCurrentDeliveryTimes(selectedDeliveryTimes);
    }, [router.asPath]);

    const deliveryTimes: DeliveryTimeItem[] = Object.keys(meta?.facetDistribution?.['variants.deliveryTimes'] || {}).map(key => ({
        label: key,
        count: meta?.facetDistribution['variants.deliveryTimes']![key]
    }));

    const handleDeliveryTimeClick = (deliveryTime) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '');

        const deliverySegmentIndex = pathSegments.findIndex(el => el.startsWith('lieferzeit:'));
        let newDeliverySegment = '';

        if (deliverySegmentIndex !== -1) {
            const currentDeliverySlugs = pathSegments[deliverySegmentIndex].replace('lieferzeit:', '').split('.');
            const isDeliveryTimeSelected = currentDeliverySlugs.includes(deliveryTime.label);

            if (isDeliveryTimeSelected) {
                newDeliverySegment = currentDeliverySlugs.filter(slug => slug !== deliveryTime.label).join('.');
            } else {
                newDeliverySegment = [...currentDeliverySlugs, deliveryTime.label].join('.');
            }

            if (newDeliverySegment) {
                pathSegments[deliverySegmentIndex] = `lieferzeit:${newDeliverySegment}`;
            } else {
                pathSegments.splice(deliverySegmentIndex, 1);
            }
        } else {
            newDeliverySegment = deliveryTime.label;
            pathSegments.push(`lieferzeit:${newDeliverySegment}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
  const queryParams = queryString ? `?${queryString.replace(/page=\d+/, 'page=1')}` : "";

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: true });
        setIsOpen(false);
    };

    const resetDeliveryTimes = () => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter((seg) => seg !== '');

        // Remove the delivery time segment from the path segments
        const newPathSegments = pathSegments.filter((segment) => !segment.startsWith("lieferzeit:"));

        const updatedPath = `/${newPathSegments.join("/")}`.replace(/\/+/g, "/");
        const queryParams = queryString ? `?${queryString}` : "";

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: true});
        setCurrentDeliveryTimes([]); // Clear the current delivery times state
        setIsOpen(false); // Close the drawer
    };

    if (deliveryTimes.length === 0) {
        return null;
    }

    return (
        <div className="w-auto">
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    {type === 'single' ?
                    <Button
                        size="sm"
                        variant="outline"
                        className={`flex w-full ${isOpen || currentDeliveryTimes.length > 0 ? "bg-blue-500 text-white" : ""}`}
                    >
                        <span>Lieferzeiten</span>
                        {currentDeliveryTimes.length > 0 && (
                            <span className="ml-2 text-xs font-thin">({currentDeliveryTimes.length})</span>
                        )}
                    </Button> :
                        <Button
                            size="sm"
                            variant={'outline'}
                            className={` flex justify-between w-full   ${isOpen || currentDeliveryTimes.length > 0 ? "bg-blue-500 text-white" : ""}`}
                        >
                            <div className={'flex justify-start'}>
                                <span>Lieferzeiten</span>
                                {currentDeliveryTimes.length > 0 && (
                                    <span className="ml-2 text-sm font-thin">({currentDeliveryTimes.length})</span>
                                )}
                            </div>
                            <ChevronRight className={'w-4 h-4 ml-auto'}/>

                        </Button>

                    }
                </DrawerTrigger>
                <DrawerContent className="h-3/4">
                    <div className="h-full relative flex flex-col py-1">
                        <DrawerHeader>
                            <DrawerTitle>Lieferzeiten: {currentDeliveryTimes.map(el => el.label).join(', ')}</DrawerTitle>
                        </DrawerHeader>
                        <ScrollArea className="h-auto w-full flex justify-center p-4">
                            <ul>
                                {deliveryTimes.map((item) => (
                                    <li key={item.label} className="mb-1 relative w-full">
                                        <Button
                                            size={'sm'}
                                            variant={currentDeliveryTimes.some(d => d.label === item.label) ? 'solid' : 'outline'}
                                            onClick={() => handleDeliveryTimeClick(item)}
                                            className={`relative w-full ${currentDeliveryTimes.some(d => d.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            <span className={'truncate'}>{unslugify(item.label)}</span>
                                            <span className={(currentDeliveryTimes.some(d => d.label === item.label) ? 'text-white' : 'text-gray-700') + ' ml-2 font-light text-xs'}>
                                                {item.count}
                                            </span>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                        <DrawerFooter className={''}>
                            <DrawerClose asChild>
                                <Button variant="outline">Schließen</Button>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Button variant="link" onClick={resetDeliveryTimes}>Zurücksetzen</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
