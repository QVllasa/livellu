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
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
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
        // Extract the current material from the route
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const materialSlug = pathSegments.find(segment => findMaterialBySlug(allMaterials, segment.toLowerCase()));

        if (!materialSlug) {
            setFilteredMaterials(allMaterials);
            setCurrentMaterial(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        // Find the current material using the original nested structure
        const currentMaterial = findMaterialBySlug(allMaterials, materialSlug.toLowerCase());

        if (!currentMaterial) {
            setFilteredMaterials(allMaterials);
            setCurrentMaterial(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        setCurrentMaterial(currentMaterial);
        setSelectedMaterial(currentMaterial);
    }, [router.asPath, router.query, allMaterials]);

    const handleMaterialClick = (material: Material) => {
        if (selectedMaterial?.slug === material.slug) {
            // Unselect the material
            setCurrentMaterial(null);
            setSelectedMaterial(null);
            // Remove material from the URL
            const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");
            const updatedPathSegments = pathSegments.filter(segment => segment.toLowerCase() !== material.slug.toLowerCase());
            const updatedPath = `/${updatedPathSegments.join('/')}`.replace(/\/+/g, '/');
            router.push(updatedPath);
        } else {
            // Select the material
            const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");
            const updatedPathSegments = pathSegments.filter(segment => !allMaterials.some(cat => cat.slug.toLowerCase() === segment));
            const updatedPath = `/${[...updatedPathSegments, material.slug.toLowerCase()].join('/')}`.replace(/\/+/g, '/');
            setCurrentMaterial(material);
            setSelectedMaterial(material);
            router.push(updatedPath);
        }
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
                                {capitalize(currentMaterial?.label)}
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
                                    <li key={item.id} className="mb-1 relative w-56">
                                        <Button
                                            size={'sm'}
                                            variant={selectedMaterial?.slug === item.slug ? 'solid' : 'outline'}
                                            onClick={() => handleMaterialClick(item)}
                                            className={`relative w-full ${selectedMaterial?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            <span className={'truncate'}> {capitalize(item.label)}</span>
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
