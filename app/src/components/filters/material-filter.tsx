import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";
import {useAtom} from "jotai";
import {Material} from "@/types";
import {allMaterialsAtom, currentMaterialAtom} from "@/store/filters";
import {findMaterialBySlug} from "@/framework/utils/find-by-slug";
import {arrangePathSegments} from "@/lib/utils";

export const MaterialFilter = () => {
    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [currentMaterial, setCurrentMaterial] = useAtom(currentMaterialAtom);
    const [allMaterials] = useAtom(allMaterialsAtom);


    useEffect(() => {
        if (!searchTerm) {
            setFilteredMaterials(allMaterials);
        }
    }, [allMaterials, searchTerm]);

    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const materialSlug = pathSegments.find(segment => segment.startsWith('material-'));

        if (!materialSlug) {
            setFilteredMaterials(allMaterials);
            setCurrentMaterial(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        const foundMaterial = findMaterialBySlug(allMaterials, materialSlug);

        if (!foundMaterial) {
            setFilteredMaterials(allMaterials);
            setCurrentMaterial(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        setCurrentMaterial(foundMaterial);
    }, [router.asPath, router.query, allMaterials]);

    const handleMaterialClick = (material: Material) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '' && seg !== 'moebel');

        const materialIndex = pathSegments.findIndex(el => el?.startsWith('material-'));

        if (materialIndex !== -1) {
            if (currentMaterial?.slug === material.slug) {
                pathSegments.splice(materialIndex, 1); // Remove the material if it is clicked again
                setCurrentMaterial(null);
            } else {
                pathSegments[materialIndex] = `${material.slug.toLowerCase()}`;
                setCurrentMaterial(material);
            }
        } else {
            pathSegments.push(`${material.slug.toLowerCase()}`);
            setCurrentMaterial(material);
        }

        // Sort segments after
        const sortedPathSegments = arrangePathSegments(pathSegments);

        const updatedPath = `/moebel/${sortedPathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: false});
    };


    return (
        <div className="w-64 p-4 relative">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-medium">Material:
                            {/*<span className={'font-bold'}>*/}
                            {/*    {capitalize(currentMaterial?.label ?? "")}*/}
                            {/*</span>*/}
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="max-h-64 overflow-y-scroll w-full">
                            <ul>
                                {filteredMaterials.map((item) => (
                                    <MaterialItem
                                        key={item.id}
                                        item={item}
                                        currentMaterial={currentMaterial}
                                        handleMaterialClick={handleMaterialClick}
                                    />
                                ))}
                            </ul>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

const MaterialItem = ({item, currentMaterial, handleMaterialClick}: {item: Material, currentMaterial: Material, handleMaterialClick: (material: Material) => void}) => {
    return (
        <>
            <li key={item.id} className="mb-1 relative w-56">
                <Button
                    size={'sm'}
                    variant={currentMaterial?.slug === item.slug ? null : 'outline'}
                    onClick={() => handleMaterialClick(item)}
                    className={`relative w-full font-bold ${currentMaterial?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}
                >
                    <span className={'truncate'}>{capitalize(item.label)}</span>
                </Button>
            </li>
            {item?.child_materials && item?.child_materials?.length > 0 && (
                <ul className="pl-4">
                    {item?.child_materials?.map((child) => (
                            <MaterialItem
                                key={child.id}
                                item={child}
                                currentMaterial={currentMaterial}
                                handleMaterialClick={handleMaterialClick}
                            />
                    ))}
                </ul>
            )}
        </>
    );
};
