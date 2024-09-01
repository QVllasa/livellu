import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/shadcn/components/ui/popover";
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
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Initialize current widths based on URL
    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const widthSegment = pathSegments.find(segment => segment.startsWith('breite:'));

        if (!widthSegment) {
            setCurrentWidths([]);
            return;
        }

        const decodedWidthSegment = decodeURIComponent(widthSegment);
        const widthSlugs = decodedWidthSegment.replace('breite:', '').split('.');
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
            const currentWidthSlugs = decodeURIComponent(pathSegments[widthSegmentIndex].replace('breite:', '')).split('.');
            const isWidthSelected = currentWidthSlugs.includes(width.label.toLowerCase());

            if (isWidthSelected) {
                newWidthSegment = currentWidthSlugs.filter(slug => slug !== width.label.toLowerCase()).join('.');
            } else {
                newWidthSegment = [...currentWidthSlugs, width.label.toLowerCase()].join('.');
            }

            if (newWidthSegment) {
                pathSegments[widthSegmentIndex] = `breite:${encodeURIComponent(newWidthSegment)}`;
            } else {
                pathSegments.splice(widthSegmentIndex, 1);
            }
        } else {
            newWidthSegment = width.label;
            pathSegments.push(`breite:${encodeURIComponent(newWidthSegment.toLowerCase())}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: false });
    };

    if (widths.length === 0) {
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
                        className={`flex w-full ${isOpen || currentWidths.length > 0 ? "bg-blue-500 text-white" : ""}`}
                    >
                        <span>Breite</span>
                        {currentWidths.length > 0 && (
                            <span className="ml-2 text-xs font-thin">({currentWidths.length})</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <ScrollArea className="h-72 w-full">
                        <ul>
                            {widths.map((item) => (
                                <li key={item.label} className="mb-1 relative w-56">
                                    <Button
                                        size="sm"
                                        variant={currentWidths.some(w => w.label === item.label) ? null : 'outline'}
                                        onClick={() => handleWidthClick(item)}
                                        className={`relative w-full ${currentWidths.some(w => w.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                    >
                                        <span className="truncate">{formatWidthLabel(item.label)}</span>
                                        <span className={`${currentWidths.some(w => w.label === item.label) ? 'text-white' : 'text-gray-700'} ml-2 font-light text-xs`}>
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
