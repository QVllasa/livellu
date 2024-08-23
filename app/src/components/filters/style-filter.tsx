import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";

// Define the structure of the filter items
interface StyleItem {
    label: string;
    count: number;
}

// Utility function to unslugify values
const unslugify = (text: string): string => {
    return text
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

interface StyleFilterProps {
    meta: {
        facetDistribution: {
            'variants.style'?: Record<string, number>;
        };
    };
}

export const StyleFilter = ({ meta }: StyleFilterProps) => {
    const [currentStyles, setCurrentStyles] = useState<StyleItem[]>([]);
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

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: false });
    };

    return (
        <div className="w-auto">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="style">
                    <AccordionTrigger>
                        <h4 className="pl-4 mb-3 text-sm font-semibold text-lg">
                            Stil <span className={'text-xs font-light'}>({styles.length})</span>
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="h-72 w-full">
                            <ul>
                                {styles.map((item) => (
                                    <li key={item.label} className="mb-1 relative w-56">
                                        <Button
                                            size={'sm'}
                                            variant={currentStyles.some(s => s.label === item.label) ? null : 'outline'}
                                            onClick={() => handleStyleClick(item)}
                                            className={`relative w-full ${currentStyles.some(s => s.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            <span className={'truncate'}>{capitalize(item.label)}</span>
                                            <span className={(currentStyles.some(s => s.label === item.label) && 'text-white') + ' ml-2 font-light text-gray-700 text-xs'}>{item.count}</span>
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
