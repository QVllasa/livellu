import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/components/ui/accordion";
import { capitalize } from "lodash";
import { useAtom } from "jotai";
import { Material } from "@/types";
import { currentMaterialAtom } from "@/store/material";
import { findMaterialBySlug } from "@/framework/utils/find-by-slug";

export const MaterialFilter = ({ allMaterials }) => {
    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [currentMaterial, setCurrentMaterial] = useAtom(currentMaterialAtom);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredMaterials(allMaterials);
        }
    }, [allMaterials, searchTerm]);

    useEffect(() => {
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const materialSlug = pathSegments.find(segment => findMaterialBySlug(allMaterials, segment.toLowerCase()));

        console.log("materialSlug: ", materialSlug)

        if (!materialSlug) {
            setFilteredMaterials(allMaterials);
            setCurrentMaterial(null);
            setSearchTerm('');
            return;
        }

        const foundMaterial = findMaterialBySlug(allMaterials, materialSlug.toLowerCase());

        console.log("foundMaterial: ", foundMaterial);

        if (!foundMaterial) {
            setFilteredMaterials(allMaterials);
            setCurrentMaterial(null);
            setSearchTerm('');
            return;
        }

        setCurrentMaterial(foundMaterial);
    }, [router.asPath, router.query, allMaterials]);

    useEffect(() => {
        console.log("currentMaterial updated: ", currentMaterial);
    }, [currentMaterial]);

    const handleMaterialClick = (material) => {
        console.log("material clicked: ", material);
        const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");

        const updatedPathSegments = pathSegments.filter(segment => !findMaterialBySlug(allMaterials, segment.toLowerCase()));
        const newPathSegments = [...updatedPathSegments, material.slug.toLowerCase()];
        const updatedPath = `/${newPathSegments.join('/')}`.replace(/\/+/g, '/');

        setCurrentMaterial(material);
        router.push(updatedPath);
    };

    const handleSearchSelect = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value === '') {
            setFilteredMaterials(allMaterials);
            return;
        }
        setFilteredMaterials(allMaterials.filter((item) => item.label.toLowerCase().includes(value.toLowerCase())));
    };

    return (
        <div className="w-64 p-4 relative">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-medium">Material{': '}
                            <span className={'font-bold'}>
                                {capitalize(currentMaterial?.label ?? "None")}
                            </span>
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="w-full mb-4">
                            <Input
                                type="text"
                                placeholder="Search materials..."
                                value={searchTerm}
                                onChange={handleSearchSelect}
                            />
                        </div>
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

const MaterialItem = ({ item, currentMaterial, handleMaterialClick }) => {
    return (
        <>
            <li key={item.id} className="mb-1 relative w-56">
                <Button
                    size={'sm'}
                    variant={currentMaterial?.slug === item.slug ? 'solid' : 'outline'}
                    onClick={() => handleMaterialClick(item)}
                    className={`relative w-full font-bold ${currentMaterial?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}
                >
                    <span className={'truncate'}>{capitalize(item.label)}</span>
                </Button>
            </li>
            {item.child_materials?.data.length > 0 && (
                <ul className="pl-4">
                    {item.child_materials.data.map((child) => (
                        <MaterialItem
                            key={child.id}
                            item={{ id: child.id, ...child.attributes }}
                            currentMaterial={currentMaterial}
                            handleMaterialClick={handleMaterialClick}
                        />
                    ))}
                </ul>
            )}
        </>
    );
};
