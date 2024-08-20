import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {formatWidthLabel, sortWidths} from "@/lib/utils";

// Define the structure of the filter items
export interface WidthItem {
    label: string;
    count: number;
}


interface WidthFilterProps {
    meta: {
        facetDistribution: {
            'variants.width'?: Record<string, number>;
        };
    };
}

export const WidthFilter = ({ meta }: WidthFilterProps) => {
    const [currentWidths, setCurrentWidths] = useState<WidthItem[]>([]);
    const router = useRouter();

    // Initialize current widths based on URL
    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const widthSegment = pathSegments.find(segment => segment.startsWith('breite:'));

        if (!widthSegment) {
            setCurrentWidths([]);
            return;
        }

        const widthSlugs = widthSegment.replace('breite:', '').split('.');
        const selectedWidths = widthSlugs.map(slug => ({ label: slug }));
        setCurrentWidths(selectedWidths);
    }, [router.asPath]);

    let widths: WidthItem[] = Object.keys(meta?.facetDistribution?.['variants.width'] || {}).map(key => ({
        label: key,
        count: meta.facetDistribution['variants.width']![key],
    }));

    // Sort the widths using our custom function
    widths = sortWidths(widths);

    const handleWidthClick = (width: WidthItem) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '');

        const widthSegmentIndex = pathSegments.findIndex(el => el.startsWith('breite:'));
        let newWidthSegment = '';

        if (widthSegmentIndex !== -1) {
            const currentWidthSlugs = pathSegments[widthSegmentIndex].replace('breite:', '').split('.');
            const isWidthSelected = currentWidthSlugs.includes(width.label);

            if (isWidthSelected) {
                newWidthSegment = currentWidthSlugs.filter(slug => slug !== width.label).join('.');
            } else {
                newWidthSegment = [...currentWidthSlugs, width.label].join('.');
            }

            if (newWidthSegment) {
                pathSegments[widthSegmentIndex] = `breite:${newWidthSegment}`;
            } else {
                pathSegments.splice(widthSegmentIndex, 1);
            }
        } else {
            newWidthSegment = width.label;
            pathSegments.push(`breite:${newWidthSegment}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: false });
    };

    return (
        <div className="w-auto">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="width">
                    <AccordionTrigger>
                        <h4 className="pl-4 mb-3 text-sm font-semibold text-lg">
                            Breite <span className={'text-xs font-light'}>({widths.length})</span>
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="h-72 w-full">
                            <ul>
                                {widths.map((item) => (
                                    <li key={item.label} className="mb-1 relative w-56">
                                        <Button
                                            size={'sm'}
                                            variant={currentWidths.some(w => w.label === item.label) ? null : 'outline'}
                                            onClick={() => handleWidthClick(item)}
                                            className={`relative w-full ${currentWidths.some(w => w.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            <span className={'truncate'}>{formatWidthLabel(item.label)}</span>
                                            <span className={(currentWidths.some(w => w.label === item.label) && 'text-white') + ' ml-2 font-light text-gray-700 text-xs'}>{item.count}</span>
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
