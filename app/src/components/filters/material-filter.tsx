import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";

// Define the structure of the filter items
interface MaterialItem {
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

interface MaterialFilterProps {
    meta: {
        facetDistribution: {
            'variants.materials'?: Record<string, number>;
        };
    };
}

export const MaterialFilter = ({ meta }: MaterialFilterProps) => {
    const [currentMaterials, setCurrentMaterials] = useState<MaterialItem[]>([]);
    const router = useRouter();

    // Initialize current materials based on URL
    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const materialSegment = pathSegments.find(segment => segment.startsWith('material:'));

        if (!materialSegment) {
            setCurrentMaterials([]);
            return;
        }

        const materialSlugs = materialSegment.replace('material:', '').split('.');
        const selectedMaterials = materialSlugs.map(slug => ({ label: slug }));
        setCurrentMaterials(selectedMaterials);
    }, [router.asPath]);

    const materials: MaterialItem[] = Object.keys(meta?.facetDistribution?.['variants.materials'] || {}).map(key => ({
        label: key,
        count: meta.facetDistribution['variants.materials']![key],
    }));

    const handleMaterialClick = (material: MaterialItem) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '');

        const materialSegmentIndex = pathSegments.findIndex(el => el.startsWith('material:'));
        let newMaterialSegment = '';

        if (materialSegmentIndex !== -1) {
            const currentMaterialSlugs = pathSegments[materialSegmentIndex].replace('material:', '').split('.');
            const isMaterialSelected = currentMaterialSlugs.includes(material.label);

            if (isMaterialSelected) {
                newMaterialSegment = currentMaterialSlugs.filter(slug => slug !== material.label).join('.');
            } else {
                newMaterialSegment = [...currentMaterialSlugs, material.label].join('.');
            }

            if (newMaterialSegment) {
                pathSegments[materialSegmentIndex] = `material:${newMaterialSegment}`;
            } else {
                pathSegments.splice(materialSegmentIndex, 1);
            }
        } else {
            newMaterialSegment = material.label;
            pathSegments.push(`material:${newMaterialSegment}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: false });
    };

    return (
        <div className="w-auto">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="material">
                    <AccordionTrigger>
                        <h4 className="pl-4 mb-3 text-sm font-semibold text-lg">
                            Material <span className={'text-xs font-light'}>({materials.length})</span>
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="h-72 w-full">
                            <ul>
                                {materials.map((item) => (
                                    <li key={item.label} className="mb-1 relative w-56">
                                        <Button
                                            size={'sm'}
                                            variant={currentMaterials.some(m => m.label === item.label) ? null : 'outline'}
                                            onClick={() => handleMaterialClick(item)}
                                            className={`relative w-full ${currentMaterials.some(m => m.label === item.label) ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            <span className={'truncate'}>{capitalize(item.label)}</span>
                                            <span className={(currentMaterials.some(m => m.label === item.label) && 'text-white') + ' ml-2 font-light text-gray-700 text-xs'}>{item.count}</span>
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
