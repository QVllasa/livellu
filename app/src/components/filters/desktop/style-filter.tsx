import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {capitalize} from "lodash";
import {Popover, PopoverContent, PopoverTrigger} from "@/shadcn/components/ui/popover";

// Define the structure of the filter items
interface StyleItem {
    label: string;
    count: number;
}

interface StyleFilterProps {
    meta: {
        facetDistribution: {
            'variants.style'?: Record<string, number>;
        };
    };
}

export const StyleFilter = ({ meta }: StyleFilterProps) => {
    const [currentStyles, setCurrentStyles] = useState<StyleItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Initialize current styles based on URL
    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const styleSegment = pathSegments.find(segment => segment.startsWith('stil:'));

        if (!styleSegment) {
            setCurrentStyles([]);
            return;
        }

        const styleSlugs = styleSegment.replace('stil:', '').split('.');
        const selectedStyles = styleSlugs.map(slug => ({ label: slug }));
        setCurrentStyles(selectedStyles);
    }, [router.asPath]);

    const styles: StyleItem[] = Object.keys(meta?.facetDistribution?.['variants.style'] || {}).map(key => ({
        label: key,
        count: meta.facetDistribution['variants.style']![key],
    }));

    const handleStyleClick = (style: StyleItem) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '');

        const styleSegmentIndex = pathSegments.findIndex(el => el.startsWith('stil:'));
        let newStyleSegment = '';

        if (styleSegmentIndex !== -1) {
            const currentStyleSlugs = pathSegments[styleSegmentIndex].replace('stil:', '').split('.');
            const isStyleSelected = currentStyleSlugs.includes(style.label);

            if (isStyleSelected) {
                newStyleSegment = currentStyleSlugs.filter(slug => slug !== style.label).join('.');
            } else {
                newStyleSegment = [...currentStyleSlugs, style.label].join('.');
            }

            if (newStyleSegment) {
                pathSegments[styleSegmentIndex] = `stil:${newStyleSegment}`;
            } else {
                pathSegments.splice(styleSegmentIndex, 1);
            }
        } else {
            newStyleSegment = style.label;
            pathSegments.push(`stil:${newStyleSegment}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: true });
    };

    if (styles.length === 0) {
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
                        className={`flex  w-full ${isOpen || currentStyles.length > 0 ? "bg-blue-500 text-white" : ""}`}
                    >
                        <span>Stil</span>
                        {currentStyles.length > 0 && (
                            <span className="ml-2 text-xs font-thin">({currentStyles.length})</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <ScrollArea className="h-72 w-full">
                        <ul>
                            {styles.map((item) => (
                                <li key={item.label} className="mb-1 relative w-56">
                                    <Button
                                        size="sm"
                                        variant={currentStyles.some(s => s.label === item.label) ? null : 'outline'}
                                        onClick={() => handleStyleClick(item)}
                                        className={`relative w-full ${currentStyles.some(s => s.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                    >
                                        <span className="truncate">{capitalize(item.label)}</span>
                                        <span className={`${currentStyles.some(s => s.label === item.label) ? 'text-white' : 'text-gray-700'} ml-2 font-light text-xs`}>
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
