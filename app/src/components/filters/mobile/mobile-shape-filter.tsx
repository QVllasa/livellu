import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {capitalize} from "lodash";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shadcn/components/ui/drawer";
import {ChevronRight} from "lucide-react";

// Define the structure of the filter items
interface ShapeItem {
    label: string;
    count: number;
}

interface ShapeFilterProps {
    meta: {
        facetDistribution: {
            'variants.shape'?: Record<string, number>;
        };
    };
    type: 'single' | 'multi';
}

export const MobileShapeFilter = ({meta, type}: ShapeFilterProps) => {
    const [currentShapes, setCurrentShapes] = useState<ShapeItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Initialize current shapes based on URL
    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const shapeSegment = pathSegments.find(segment => segment.startsWith('form:'));

        if (!shapeSegment) {
            setCurrentShapes([]);
            return;
        }

        const shapeSlugs = shapeSegment.replace('form:', '').split('.');
        const selectedShapes = shapeSlugs.map(slug => ({label: slug}));
        setCurrentShapes(selectedShapes);
    }, [router.asPath]);

    const shapes: ShapeItem[] = Object.keys(meta?.facetDistribution?.['variants.shape'] || {}).map(shapeKey => ({
        label: shapeKey,
        count: meta.facetDistribution['variants.shape']![shapeKey],
    }));

    const handleShapeClick = (shape: ShapeItem) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '');

        const shapeSegmentIndex = pathSegments.findIndex(el => el.startsWith('form:'));
        let newShapeSegment = '';

        if (shapeSegmentIndex !== -1) {
            const currentShapeSlugs = pathSegments[shapeSegmentIndex].replace('form:', '').split('.');
            const isShapeSelected = currentShapeSlugs.includes(shape.label);

            if (isShapeSelected) {
                newShapeSegment = currentShapeSlugs.filter(slug => slug !== shape.label).join('.');
            } else {
                newShapeSegment = [...currentShapeSlugs, shape.label].join('.');
            }

            if (newShapeSegment) {
                pathSegments[shapeSegmentIndex] = `form:${newShapeSegment}`;
            } else {
                pathSegments.splice(shapeSegmentIndex, 1);
            }
        } else {
            newShapeSegment = shape.label;
            pathSegments.push(`form:${newShapeSegment}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
  const queryParams = queryString ? `?${queryString.replace(/page=\d+/, 'page=1')}` : "";

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: true});
        setIsOpen(false); // Close the drawer after selection
    };

    const resetShapes = () => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter((seg) => seg !== '');

        // Remove the shape segment from the path segments
        const newPathSegments = pathSegments.filter((segment) => !segment.startsWith('form:'));

        const updatedPath = `/${newPathSegments.join('/')}`.replace(/\/+/g, '/');
  const queryParams = queryString ? `?${queryString.replace(/page=\d+/, 'page=1')}` : "";

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: true});
        setCurrentShapes([]); // Clear the current shapes state
        setIsOpen(false); // Close the drawer
    };

    if (shapes.length === 0) {
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
                            className={`flex w-full ${isOpen || currentShapes.length > 0 ? "bg-blue-500 text-white" : ""}`}
                        >
                            <span>Form</span>
                            {currentShapes.length > 0 && (
                                <span className="ml-2 text-xs font-thin">({currentShapes.length})</span>
                            )}
                        </Button>
                        :
                        <Button
                            size="sm"
                            variant={'outline'}
                            className={` flex justify-between w-full   ${isOpen || currentShapes.length > 0 ? "bg-blue-500 text-white" : ""}`}
                        >
                            <div className={'flex justify-start'}>
                                <span>Form</span>
                                {currentShapes.length > 0 && (
                                    <span className="ml-2 text-sm font-thin">({currentShapes.length})</span>
                                )}
                            </div>
                            <ChevronRight className={'w-4 h-4 ml-auto'}/>

                        </Button>
                    }
                </DrawerTrigger>
                <DrawerContent className={'h-3/4'}>
                    <div className={'h-full relative flex flex-col py-1'}>
                        <DrawerHeader>
                            <DrawerTitle>Form: {currentShapes.map(el => capitalize(el.label)).join(', ')}</DrawerTitle>
                        </DrawerHeader>
                        <ScrollArea className="h-auto w-full flex justify-center p-4">
                            <ul>
                                {shapes.map((item) => (
                                    <li key={item.label} className="mb-1 relative w-full">
                                        <Button
                                            size="sm"
                                            variant={currentShapes.some(s => s.label === item.label) ? null : 'outline'}
                                            onClick={() => handleShapeClick(item)}
                                            className={`relative w-full ${currentShapes.some(s => s.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            <span className="truncate">{capitalize(item.label)}</span>
                                            <span className={`${currentShapes.some(s => s.label === item.label) ? 'text-white' : 'text-gray-700'} ml-2 font-light text-xs`}>
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
                                <Button variant="link" onClick={resetShapes}>Zurücksetzen</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
