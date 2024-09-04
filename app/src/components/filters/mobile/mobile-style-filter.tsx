import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {capitalize} from "lodash";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shadcn/components/ui/drawer";
import {ChevronRight} from "lucide-react";

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
    type: 'single' | 'multi';
}

export const MobileStyleFilter = ({ meta, type }: StyleFilterProps) => {
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
        setIsOpen(false); // Close the drawer after selection
    };

    const resetStyles = () => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter((seg) => seg !== '');

        // Remove the style segment from the path segments
        const newPathSegments = pathSegments.filter((segment) => !segment.startsWith('stil:'));

        const updatedPath = `/${newPathSegments.join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: true });
        setCurrentStyles([]); // Clear the current styles state
        setIsOpen(false); // Close the drawer
    };

    if (styles.length === 0) {
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
                        className={`flex w-full ${isOpen || currentStyles.length > 0 ? "bg-blue-500 text-white" : ""}`}
                    >
                        <span>Stil</span>
                        {currentStyles.length > 0 && (
                            <span className="ml-2 text-xs font-thin">({currentStyles.length})</span>
                        )}
                    </Button>
                        :
                        <Button
                            size="sm"
                            variant={'outline'}
                            className={` flex justify-between w-full   ${isOpen || currentStyles.length > 0 ? "bg-blue-500 text-white" : ""}`}
                        >
                            <div className={'flex justify-start'}>
                                <span>Stil</span>
                                {currentStyles.length > 0 && (
                                    <span className="ml-2 text-sm font-thin">({currentStyles.length})</span>
                                )}
                            </div>
                            <ChevronRight className={'w-4 h-4 ml-auto'}/>

                        </Button>
                    }
                </DrawerTrigger>
                <DrawerContent className={'h-3/4'}>
                    <div className={'h-full relative flex flex-col py-1'}>
                        <DrawerHeader>
                            <DrawerTitle>Stil: {currentStyles.map(el => capitalize(el.label)).join(', ')}</DrawerTitle>
                        </DrawerHeader>
                        <ScrollArea className="h-auto w-full flex justify-center p-4">
                            <ul>
                                {styles.map((item) => (
                                    <li key={item.label} className="mb-1 relative w-full">
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
                        <DrawerFooter className={''}>
                            <DrawerClose asChild>
                                <Button variant="outline">Schließen</Button>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Button variant="link" onClick={resetStyles}>Zurücksetzen</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
