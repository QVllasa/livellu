import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Input} from "@/shadcn/components/ui/input";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";
import {useAtom} from "jotai";
import {Color} from "@/types";
import {allColorAtom, currentColorAtom} from "@/store/color";

// Helper function to find color by slug in the nested structure
const findColorBySlug = (colors, slug) => {
    for (const color of colors) {
        if (color.slug?.toLowerCase() === slug || color.attributes?.slug?.toLowerCase() === slug) {
            return {id: color.id, ...color};
        }
        if (color.child_categories?.data?.length) {
            const found = findColorBySlug(color.child_colors.data, slug);
            if (found) {
                return {id: found.id, ...found.attributes};
            }
        }
    }
    return null;
};

export const ColorFilter = () => {
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [filteredColors, setFilteredColors] = useState<Color[]>([]);
    const [childColors, setChildColors] = useState<Color[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [allColors] = useAtom(allColorAtom);
    const [currentColor, setCurrentColor] = useAtom(currentColorAtom);

    useEffect(() => {
        // Extract the current color from the route
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const colorSlug = pathSegments.find(segment => findColorBySlug(allColors, segment.toLowerCase()));

        console.log("pathSegments: ", pathSegments);
        console.log("colorSlug: ", colorSlug);

        if (!colorSlug) {
            console.log("no color slug found");
            setFilteredColors(allColors);
            setChildColors(allColors);
            setCurrentColor(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        // Find the current color using the original nested structure
        const currentColor = findColorBySlug(allColors, colorSlug.toLowerCase());

        if (!currentColor) {
            console.log("no current color found");
            setFilteredColors(allColors);
            setChildColors(allColors);
            setCurrentColor(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        // Determine the categories to display
        const categoriesToDisplay = currentColor.child_categories?.data?.length ?
            currentColor.child_categories.data.map(item => ({id: item.id, ...item.attributes})) : [currentColor];

        // Set the filtered categories
        setChildColors(categoriesToDisplay);
        setFilteredColors(categoriesToDisplay);
        setSearchTerm(''); // Clear the input

        console.log("categoriesToDisplay: ", categoriesToDisplay);

        setCurrentColor(currentColor);
        setSelectedColor(currentColor);
    }, [router.asPath, router.query, allColors]);

    const handleColorClick = (color: Color) => {
        const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");

        console.log("pathSegments: ", pathSegments);
        console.log("color: ", color);

        const updatedPathSegments = pathSegments.filter(segment => !allColors.some(cat => cat.slug.toLowerCase() === segment));
        const updatedPath = `/${[...updatedPathSegments, color.slug.toLowerCase()].join('/')}`.replace(/\/+/g, '/');

        setCurrentColor(color);
        setSelectedColor(color);
        router.push(updatedPath);
    };

    const handleSearchSelect = (event) => {
        const value = event.target.value;
        if (value === '') {
            setFilteredColors(childColors);
            setSearchTerm('');
            return;
        }
        setSearchTerm(value);
        setFilteredColors(childColors.filter((item: Color) => item.label.toLowerCase().includes(value.toLowerCase())));
    };

    return (
        <div className="w-64 p-4">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-bold">Kategorien</h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        {childColors.length > 1 && (
                            <div className="w-full mb-4">
                                <Input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={handleSearchSelect}
                                />
                            </div>
                        )}
                        <ScrollArea className="max-h-64 overflow-auto">
                            <ul>
                                {filteredColors.map((item) => (
                                    <li key={item.id} className="mb-1">
                                        <Button
                                            size={'sm'}
                                            variant={selectedColor?.slug === item.slug ? 'solid' : 'outline'}
                                            onClick={() => handleColorClick(item)}
                                            className={`w-full ${selectedColor?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}
                                            disabled={selectedColor?.slug === item.slug} // Disable the button if it is the selected color
                                        >
                                            {capitalize(item.label)}
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
