import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";
import {useAtom} from "jotai";
import {Color} from "@/types";
import {allColorAtom, currentColorAtom} from "@/store/color";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/shadcn/components/ui/tooltip";

// Helper function to find color by slug in the nested structure
const findColorBySlug = (colors, slug) => {
    for (const color of colors) {
        if (color.slug?.toLowerCase() === slug || color.attributes?.slug?.toLowerCase() === slug) {
            return {id: color.id, ...color};
        }
    }
    return null;
};

export const ColorFilter = () => {
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [filteredColors, setFilteredColors] = useState<Color[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [allColors] = useAtom(allColorAtom);
    const [currentColor, setCurrentColor] = useAtom(currentColorAtom);

    console.log("filteredColors: ", filteredColors);

    useEffect(() => {
        // Extract the current color from the route
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const colorSlug = pathSegments.find(segment => findColorBySlug(allColors, segment.toLowerCase()));

        console.log("pathSegments: ", pathSegments);
        console.log("colorSlug: ", colorSlug);

        if (!colorSlug) {
            console.log("no color slug found");
            setFilteredColors(allColors);
            setCurrentColor(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        // Find the current color using the original nested structure
        const currentColor = findColorBySlug(allColors, colorSlug.toLowerCase());

        if (!currentColor) {
            console.log("no current color found");
            setFilteredColors(allColors);
            setCurrentColor(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        setSearchTerm(''); // Clear the input

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


    return (
        <div className="w-64 p-4 relative">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-medium">Farbe{': '}
                            <span className={'font-bold'}>
                                {capitalize(currentColor?.label)}
                            </span>
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>

                        <ScrollArea className="max-h-64 overflow-y-scroll w-full">
                            <ul className="grid grid-cols-5 gap-1">
                                {filteredColors.map((item) => (
                                    <li key={item.id} className="relative">
                                        <Tooltip delay={[100, 0]}>
                                            <TooltipTrigger>
                                                <Button
                                                    size={'icon'}
                                                    variant="ghost"
                                                    style={{
                                                        backgroundColor: item.code ?? 'transparent',
                                                        width: '32px',
                                                        height: '32px',
                                                        border: item.code ? 'none' : '1px solid #ccc',
                                                        backdropFilter: item.code ? 'none' : 'blur(10px)',
                                                        WebkitBackdropFilter: item.code ? 'none' : 'blur(10px)',
                                                        backgroundClip: 'padding-box',
                                                        borderRadius: '50%',
                                                        opacity: item.code ? '1' : '0.7'
                                                    }}
                                                    onClick={() => handleColorClick(item)}
                                                    className={`relative ${selectedColor?.slug === item.slug ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                                >
                                                    <span className="sr-only">{capitalize(item.label)}</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>{capitalize(item.label)}</span>
                                            </TooltipContent>
                                        </Tooltip>
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
