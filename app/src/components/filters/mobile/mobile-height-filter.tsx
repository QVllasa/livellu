import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shadcn/components/ui/drawer";
import {formatHeightLabel, sortHeights} from "@/lib/utils";
import {ChevronRight} from "lucide-react";

// Define the structure of the filter items
interface HeightItem {
    label: string;
    count: number;
}

interface HeightFilterProps {
    meta: {
        facetDistribution: {
            'variants.height'?: Record<string, number>;
        };
    };
    type: 'single' | 'multi';
}

export const MobileHeightFilter = ({meta, type}: HeightFilterProps) => {
    const [currentHeights, setCurrentHeights] = useState<HeightItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Initialize current heights based on URL
    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const heightSegment = pathSegments.find(segment => segment.startsWith('hoehe:'));

        if (!heightSegment) {
            setCurrentHeights([]);
            return;
        }

        const heightSlugs = heightSegment.replace('hoehe:', '').split('.');
        const selectedHeights = heightSlugs.map(slug => ({label: slug}));
        setCurrentHeights(selectedHeights);
    }, [router.asPath]);

    let heights: HeightItem[] = Object.keys(meta?.facetDistribution?.['variants.height'] || {}).map(key => ({
        label: key,
        count: meta.facetDistribution['variants.height']![key],
    }));

    // Sort the heights using our custom function
    heights = sortHeights(heights);

    const handleHeightClick = (height: HeightItem) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '');

        const heightSegmentIndex = pathSegments.findIndex(el => el.startsWith('hoehe:'));
        let newHeightSegment = '';

        if (heightSegmentIndex !== -1) {
            const currentHeightSlugs = pathSegments[heightSegmentIndex].replace('hoehe:', '').split('.');
            const isHeightSelected = currentHeightSlugs.includes(height.label);

            if (isHeightSelected) {
                newHeightSegment = currentHeightSlugs.filter(slug => slug !== height.label).join('.');
            } else {
                newHeightSegment = [...currentHeightSlugs, height.label].join('.');
            }

            if (newHeightSegment) {
                pathSegments[heightSegmentIndex] = `hoehe:${newHeightSegment}`;
            } else {
                pathSegments.splice(heightSegmentIndex, 1);
            }
        } else {
            newHeightSegment = height.label;
            pathSegments.push(`hoehe:${encodeURIComponent(newHeightSegment.toLowerCase())}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
  const queryParams = queryString ? `?${queryString.replace(/page=\d+/, 'page=1')}` : "";

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: true});
        setIsOpen(false); // Close the drawer after selecting a height
    };

    const resetHeights = () => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter((seg) => seg !== '');

        // Remove the height segment from the path segments
        const newPathSegments = pathSegments.filter((segment) => !segment.startsWith('hoehe:'));

        const updatedPath = `/${newPathSegments.join('/')}`.replace(/\/+/g, '/');
  const queryParams = queryString ? `?${queryString.replace(/page=\d+/, 'page=1')}` : "";

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: true});
        setCurrentHeights([]); // Clear the current heights state
        setIsOpen(false); // Close the drawer
    };

    if (heights.length === 0) {
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
                            className={`flex  w-full ${isOpen || currentHeights.length > 0 ? "bg-blue-500 text-white" : ""}`}
                        >
                            <span>Höhe</span>
                            {currentHeights.length > 0 && (
                                <span className="ml-2 text-xs font-thin">({currentHeights.length})</span>
                            )}
                        </Button>
                        :
                        <Button
                            size="sm"
                            variant={'outline'}
                            className={` flex justify-between w-full   ${isOpen || currentHeights.length > 0 ? "bg-blue-500 text-white" : ""}`}
                        >
                            <div className={'flex justify-start'}>
                                <span>Höhe</span>
                                {currentHeights.length > 0 && (
                                    <span className="ml-2 text-sm font-thin">({currentHeights.length})</span>
                                )}
                            </div>
                            <ChevronRight className={'w-4 h-4 ml-auto'}/>

                        </Button>
                    }
                </DrawerTrigger>
                <DrawerContent className={'h-3/4'}>
                    <div className={'h-full relative flex flex-col py-1'}>
                        <DrawerHeader>
                            <DrawerTitle>Höhe: {currentHeights.map(el => formatHeightLabel(el.label)).join(', ')}</DrawerTitle>
                        </DrawerHeader>
                        <ScrollArea className="h-auto w-full flex justify-center p-4">
                            <ul>
                                {heights.map((item) => (
                                    <li key={item.label} className="mb-1 relative w-full">
                                        <Button
                                            size="sm"
                                            variant={currentHeights.some(h => h.label === item.label) ? null : 'outline'}
                                            onClick={() => handleHeightClick(item)}
                                            className={`relative w-full ${currentHeights.some(h => h.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            <span className="truncate">{formatHeightLabel(item.label)}</span>
                                            <span className={`${currentHeights.some(h => h.label === item.label) ? 'text-white' : 'text-gray-700'} ml-2 font-light text-xs`}>
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
                                <Button variant="link" onClick={resetHeights}>Zurücksetzen</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
