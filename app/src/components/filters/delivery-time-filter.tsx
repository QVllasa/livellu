import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {unslugify} from "@/lib/utils";

export const DeliveryTimeFilter = ({ meta }) => {
    const [currentDeliveryTimes, setCurrentDeliveryTimes] = useState([]);
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
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: false });
    };

    return (
        <div className="w-auto">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="delivery-time">
                    <AccordionTrigger>
                        <h4 className="pl-4 mb-3 text-sm font-semibold text-lg">
                            Lieferzeiten <span className={'text-xs font-light'}>({deliveryTimes.length})</span>
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="h-72 w-full">
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
                                            <span className={(currentDeliveryTimes.some(d => d.label === item.label) && 'text-white') + ' ml-2 font-light text-gray-700 text-xs'}>{item.count}</span>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
