import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";

export const ShapeFilter = ({ meta }) => {
    const [currentShapes, setCurrentShapes] = useState([]);
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
        const selectedShapes = shapeSlugs.map(slug => ({ label: slug }));
        setCurrentShapes(selectedShapes);
    }, [router.asPath]);

    const shapes = Object.keys(meta?.facetDistribution?.['variants.shape'] || {}).map(shapeKey => ({
        label: shapeKey,
        count: meta.facetDistribution['variants.shape'][shapeKey],
    }));

    const handleShapeClick = (shape) => {
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
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: false});
    };


    return (
        <div className="w-auto">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shape">
                    <AccordionTrigger>
                        <h4 className="pl-4 mb-3 text-sm font-semibold text-lg">
                            Form <span className={'text-xs font-light'}>({shapes.length})</span>
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="h-72 w-full">
                            <ul>
                                {shapes.map((item) => (
                                    <li key={item.label} className="mb-1 relative w-56">
                                        <Button
                                            size={'sm'}
                                            variant={currentShapes.some(s => s.label === item.label) ? null : 'outline'}
                                            onClick={() => handleShapeClick(item)}
                                            className={`relative w-full ${currentShapes.some(s => s.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            <span className={'truncate'}>{capitalize(item.label)}</span>
                                            <span className={(currentShapes.some(s => s.label === item.label) && 'text-white') + ' ml-2 font-light text-gray-700 text-xs'}>{item.count}</span>
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
