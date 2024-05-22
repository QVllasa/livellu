import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Input} from "@/shadcn/components/ui/input";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";
import {useAtom} from "jotai";
import {Material} from "@/types";
import {allMaterialAtom, currentMaterialAtom} from "@/store/material";

// Helper function to find material by slug in the nested structure
const findMaterialBySlug = (materials, slug) => {
    for (const material of materials) {
        if (material.slug?.toLowerCase() === slug || material.attributes?.slug?.toLowerCase() === slug) {
            return {id: material.id, ...material};
        }
    }
    return null;
};

export const MaterialFilter = () => {
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
    const [childMaterials, setChildMaterials] = useState<Material[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [allMaterials] = useAtom(allMaterialAtom);
    const [currentMaterial, setCurrentMaterial] = useAtom(currentMaterialAtom);

    console.log("filteredMaterials: ", filteredMaterials);

    useEffect(() => {
        // Extract the current material from the route
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const materialSlug = pathSegments.find(segment => findMaterialBySlug(allMaterials, segment.toLowerCase()));

        console.log("pathSegments: ", pathSegments);
        console.log("materialSlug: ", materialSlug);

        if (!materialSlug) {
            console.log("no material slug found");
            setFilteredMaterials(allMaterials);

            setCurrentMaterial(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        // Find the current material using the original nested structure
        const currentMaterial = findMaterialBySlug(allMaterials, materialSlug.toLowerCase());

        if (!currentMaterial) {
            console.log("no current material found");
            setFilteredMaterials(allMaterials);

            setCurrentMaterial(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        setCurrentMaterial(currentMaterial);
        setSelectedMaterial(currentMaterial);
    }, [router.asPath, router.query, allMaterials]);

    const handleMaterialClick = (material: Material) => {
        const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");

        console.log("pathSegments: ", pathSegments);
        console.log("material: ", material);

        const updatedPathSegments = pathSegments.filter(segment => !allMaterials.some(cat => cat.slug.toLowerCase() === segment));
        const updatedPath = `/${[...updatedPathSegments, material.slug.toLowerCase()].join('/')}`.replace(/\/+/g, '/');

        setCurrentMaterial(material);
        setSelectedMaterial(material);
        router.push(updatedPath);
    };

    const handleSearchSelect = (event) => {
        const value = event.target.value;
        if (value === '') {
            setFilteredMaterials(childMaterials);
            setSearchTerm('');
            return;
        }
        setSearchTerm(value);
        setFilteredMaterials(childMaterials.filter((item: Material) => item.label.toLowerCase().includes(value.toLowerCase())));
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
                                            disabled={selectedMaterial?.slug === item.slug} // Disable the button if it is the selected material
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
