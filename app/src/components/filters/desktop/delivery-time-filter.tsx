import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/shadcn/components/ui/popover";
import {unslugify} from "@/lib/utils";

export const DeliveryTimeFilter = ({ meta }) => {
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

    const deliveryTimes = Object.keys(meta?.facetDistribution?.['variants.deliveryTimes'] || {}).map(key => ({
        label: key,
        count: meta.facetDistribution['variants.deliveryTimes'][key],
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
    };

    if (deliveryTimes.length === 0) {
        return null;
    }

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
                        className={`flex w-full ${isOpen || currentDeliveryTimes.length > 0 ? "bg-blue-500 text-white" : ""}`}
                    >
                        <span>Lieferzeiten</span>
                        {currentDeliveryTimes.length > 0 && (
                            <span className="ml-2 text-xs font-thin">({currentDeliveryTimes.length})</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <ScrollArea className="h-auto w-full">
                        <ul>
                            {deliveryTimes.map((item) => (
                                <li key={item.label} className="mb-1 relative w-56">
                                    <Button
                                        size={'sm'}
                                        variant={currentDeliveryTimes.some(d => d.label === item.label) ? null : 'outline'}
                                        onClick={() => handleDeliveryTimeClick(item)}
                                        className={`relative w-full ${currentDeliveryTimes.some(d => d.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                    >
                                        <span className={'truncate'}>{unslugify(item.label)}</span>
                                        <span className={(currentDeliveryTimes.some(d => d.label === item.label) && 'text-white') + ' ml-2 font-light text-gray-700 text-xs'}>
                                            {item.count}
                                        </span>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </PopoverContent>
            </Popover>
        </div>
    );
};
