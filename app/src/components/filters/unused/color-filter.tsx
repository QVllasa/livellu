import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";
import {useAtom} from "jotai";
import {Color} from "@/types";
import {allColorsAtom, currentColorAtom} from "@/store/filters";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/shadcn/components/ui/tooltip";
import {findColorBySlug} from "@/framework/utils/find-by-slug";
import {fetchAllColors} from "@/framework/color.ssr";


export const ColorFilter = () => {
    const [filteredColors, setFilteredColors] = useState<Color[]>([]);
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [currentColor, setCurrentColor] = useAtom(currentColorAtom);
    const [allColors, setAllColors] = useAtom(allColorsAtom);

    useEffect(() => {
        const fetchData = async () => {
            const colors = await fetchAllColors();
            setAllColors(colors);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (allColors.length > 0) {
            setFilteredColors(allColors);
        }
    }, [allColors]);

    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const colorSegment = pathSegments.find(segment => segment.startsWith('farbe:'));

        if (!colorSegment) {
            setFilteredColors(allColors);
            setCurrentColor([]);
            return;
        }

        const colorSlugs = colorSegment.replace('farbe:', '').split('.');
        const selectedColors = colorSlugs.map(slug => findColorBySlug(allColors, slug)).filter(Boolean);

        setCurrentColor(selectedColors);
    }, [router.asPath, router.query, allColors]);

    const handleColorClick = (color: Color) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '');

        const colorSegmentIndex = pathSegments.findIndex(el => el.startsWith('farbe:'));
        let newColorSegment = '';

        if (colorSegmentIndex !== -1) {
            const currentColorSlugs = pathSegments[colorSegmentIndex].replace('farbe:', '').split('.');
            const isColorSelected = currentColorSlugs.includes(color.slug);

            if (isColorSelected) {
                newColorSegment = currentColorSlugs.filter(slug => slug !== color.slug).join('.');
            } else {
                newColorSegment = [...currentColorSlugs, color.slug].join('.');
            }

            if (newColorSegment) {
                pathSegments[colorSegmentIndex] = `farbe:${newColorSegment}`;
            } else {
                pathSegments.splice(colorSegmentIndex, 1);
            }
        } else {
            newColorSegment = color.slug;
            pathSegments.push(`farbe:${newColorSegment}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: true });
    };


    return (
        <div className="w-auto">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="pl-4 mb-3 text-sm font-semibold text-lg">Farbe
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="max-h-64 overflow-y-scroll w-full">
                            <ul className="grid grid-cols-5 gap-1">
                                {filteredColors.map((item) => (
                                    <li key={item.id} className="relative">
                                        <Tooltip >
                                            <TooltipTrigger asChild>
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
