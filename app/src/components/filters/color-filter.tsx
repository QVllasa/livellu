import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { Button } from "@/shadcn/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/components/ui/accordion";
import { capitalize } from "lodash";
import { useAtom } from "jotai";
import { Color } from "@/types";
import { currentColorAtom } from "@/store/color";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/components/ui/tooltip";
import { findColorBySlug } from "@/framework/utils/find-by-slug";

export const ColorFilter = ({ allColors }) => {
    const [filteredColors, setFilteredColors] = useState<Color[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [currentColor, setCurrentColor] = useAtom(currentColorAtom);

    useEffect(() => {
        if (allColors.length > 0) {
            setFilteredColors(allColors);
        }
    }, [allColors]);

    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const colorSlug = pathSegments.find(segment => segment.startsWith('color-'));

        if (!colorSlug) {
            setFilteredColors(allColors);
            setCurrentColor(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        const currentColor = findColorBySlug(allColors, colorSlug.toLowerCase());

        if (!currentColor) {
            setFilteredColors(allColors);
            setCurrentColor(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        setCurrentColor(currentColor);
    }, [router.asPath, router.query, allColors]);

    const handleColorClick = (color) => {
        const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");

        const colorIndex = pathSegments.findIndex(segment => segment.startsWith('color-'));

        if (colorIndex !== -1) {
            if (currentColor?.slug === color.slug) {
                pathSegments.splice(colorIndex, 1); // Remove the color if it is clicked again
                setCurrentColor(null);
            } else {
                pathSegments[colorIndex] = `${color.slug.toLowerCase()}`;
                setCurrentColor(color);
            }
        } else {
            pathSegments.push(`${color.slug.toLowerCase()}`);
            setCurrentColor(color);
        }

        const updatedPath = `/${pathSegments.join('/')}`.replace(/\/+/g, '/');
        router.push(updatedPath, undefined, { scroll: false });
    };

    const handleSearchSelect = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value === '') {
            setFilteredColors(allColors);
            return;
        }
        setFilteredColors(allColors.filter((item) => item.label.toLowerCase().includes(value.toLowerCase())));
    };

    return (
        <div className="w-64 p-4 relative">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-medium">Farbe{': '}
                            <span className={'font-bold'}>
                                {capitalize(currentColor?.label ?? "None")}
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
                                                    className={`relative ${currentColor?.slug === item.slug ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
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
