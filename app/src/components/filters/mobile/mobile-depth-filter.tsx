import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shadcn/components/ui/drawer";
import {formatDepthLabel, sortDepths} from "@/lib/utils";
import {ChevronRight} from "lucide-react";

// Define the structure of the filter items
export interface DepthItem {
    label: string;
    count: number;
}

interface DepthFilterProps {
    meta: {
        facetDistribution: {
            'variants.depth'?: Record<string, number>;
        };
    };
    type: 'single' | 'multi';
}

export const MobileDepthFilter = ({meta, type}: DepthFilterProps) => {
    const [currentDepths, setCurrentDepths] = useState<DepthItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Initialize current depths based on URL
    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const depthSegment = pathSegments.find(segment => segment.startsWith('tiefe:'));

        if (!depthSegment) {
            setCurrentDepths([]);
            return;
        }

        const depthSlugs = depthSegment.replace('tiefe:', '').split('.');
        const selectedDepths = depthSlugs.map(slug => ({label: slug}));
        setCurrentDepths(selectedDepths);
    }, [router.asPath]);

    let depths: DepthItem[] = Object.keys(meta?.facetDistribution?.['variants.depth'] || {}).map(key => ({
        label: key,
        count: meta.facetDistribution['variants.depth']![key],
    }));

    // Sort the depths using our custom function
    depths = sortDepths(depths);

    const handleDepthClick = (depth: DepthItem) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '');

        const depthSegmentIndex = pathSegments.findIndex(el => el.startsWith('tiefe:'));
        let newDepthSegment = '';

        if (depthSegmentIndex !== -1) {
            const currentDepthSlugs = pathSegments[depthSegmentIndex].replace('tiefe:', '').split('.');
            const isDepthSelected = currentDepthSlugs.includes(depth.label);

            if (isDepthSelected) {
                newDepthSegment = currentDepthSlugs.filter(slug => slug !== depth.label).join('.');
            } else {
                newDepthSegment = [...currentDepthSlugs, depth.label].join('.');
            }

            if (newDepthSegment) {
                pathSegments[depthSegmentIndex] = `tiefe:${newDepthSegment}`;
            } else {
                pathSegments.splice(depthSegmentIndex, 1);
            }
        } else {
            newDepthSegment = depth.label;
            pathSegments.push(`tiefe:${encodeURIComponent(newDepthSegment.toLowerCase())}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: true});
        setIsOpen(false); // Close the drawer after selecting a depth
    };

    const resetDepths = () => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter((seg) => seg !== '');

        // Remove the depth segment from the path segments
        const newPathSegments = pathSegments.filter((segment) => !segment.startsWith('tiefe:'));

        const updatedPath = `/${newPathSegments.join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: true});
        setCurrentDepths([]); // Clear the current depths state
        setIsOpen(false); // Close the drawer
    };

    if (depths.length === 0) {
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
                            className={`flex w-full ${isOpen || currentDepths.length > 0 ? "bg-blue-500 text-white" : ""}`}
                        >
                            <span>Tiefe</span>
                            {currentDepths.length > 0 && (
                                <span className="ml-2 text-xs font-thin">({currentDepths.length})</span>
                            )}
                        </Button>
                        :
                        <Button
                            size="sm"
                            variant={'outline'}
                            className={` flex justify-between w-full   ${isOpen || currentDepths.length > 0 ? "bg-blue-500 text-white" : ""}`}
                        >
                            <div className={'flex justify-start'}>
                                <span>Tiefe</span>
                                {currentDepths.length > 0 && (
                                    <span className="ml-2 text-sm font-thin">({currentDepths.length})</span>
                                )}
                            </div>
                            <ChevronRight className={'w-4 h-4 ml-auto'}/>

                        </Button>
                    }
                </DrawerTrigger>
                <DrawerContent className={'h-3/4'}>
                    <div className={'h-full relative flex flex-col py-1'}>
                        <DrawerHeader>
                            <DrawerTitle>Tiefe: {currentDepths.map(el => formatDepthLabel(el.label)).join(', ')}</DrawerTitle>
                        </DrawerHeader>
                        <ScrollArea className="h-auto w-full flex justify-center p-4">
                            <ul>
                                {depths.map((item) => (
                                    <li key={item.label} className="mb-1 relative w-full">
                                        <Button
                                            size="sm"
                                            variant={currentDepths.some(d => d.label === item.label) ? null : 'outline'}
                                            onClick={() => handleDepthClick(item)}
                                            className={`relative w-full ${currentDepths.some(d => d.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            <span className="truncate">{formatDepthLabel(item.label)}</span>
                                            <span className={`${currentDepths.some(d => d.label === item.label) ? 'text-white' : 'text-gray-700'} ml-2 font-light text-xs`}>
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
                                <Button variant="link" onClick={resetDepths}>Zurücksetzen</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};