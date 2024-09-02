import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/shadcn/components/ui/tooltip";
import {sortColors} from "@/lib/utils";
import {capitalize} from "lodash";
import {Popover, PopoverContent, PopoverTrigger} from "@/shadcn/components/ui/popover";

// Define the structure of the filter items
export interface ColorItem {
    label: string;
    count: number;
    code: string; // To store the color code for visual representation
}

interface ColorFilterProps {
    meta: {
        facetDistribution: {
            "variants.colors"?: Record<string, number>;
        };
    };
}

export const ColorFilter = ({ meta }: ColorFilterProps) => {
    const [currentColors, setCurrentColors] = useState<ColorItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Initialize current colors based on URL
    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter((segment) => segment);
        const colorSegment = pathSegments.find((segment) => segment.startsWith("farbe:"));

        if (!colorSegment) {
            setCurrentColors([]);
            return;
        }

        const decodedColorSegment = decodeURIComponent(colorSegment);

        const colorSlugs = decodedColorSegment.replace("farbe:", "").split(".");
        const selectedColors = colorSlugs.map((slug) => ({
            label: slug,
            code: colorMap[slug.toLowerCase()] || "transparent",
        }));
        setCurrentColors(selectedColors);
    }, [router.asPath]);

    // Extract and sort colors from metadata
    let colors: ColorItem[] = Object.keys(meta?.facetDistribution?.["variants.colors"] || {}).map((key) => ({
        label: key,
        count: meta.facetDistribution["variants.colors"]![key],
        code: colorMap[key.toLowerCase()] || "transparent", // Use the colorMap to get the color code
    }));

    // Sort the colors alphabetically
    colors = sortColors(colors);

    const handleColorClick = (color: ColorItem) => {
        const [path, queryString] = router.asPath.split("?");
        const pathSegments = path.split("/").filter((seg) => seg !== "");

        const colorSegmentIndex = pathSegments.findIndex((el) => el.startsWith("farbe:"));
        let newColorSegment = "";

        if (colorSegmentIndex !== -1) {
            const currentColorSlugs = decodeURIComponent(
                pathSegments[colorSegmentIndex].replace("farbe:", "")
            ).split(".");
            const isColorSelected = currentColorSlugs.includes(color.label.toLowerCase());

            if (isColorSelected) {
                newColorSegment = currentColorSlugs.filter((slug) => slug !== color.label.toLowerCase()).join(".");
            } else {
                newColorSegment = [...currentColorSlugs, color.label.toLowerCase()].join(".");
            }

            if (newColorSegment) {
                pathSegments[colorSegmentIndex] = `farbe:${encodeURIComponent(newColorSegment.toLowerCase())}`;
            } else {
                pathSegments.splice(colorSegmentIndex, 1);
            }
        } else {
            newColorSegment = color.label;
            pathSegments.push(`farbe:${encodeURIComponent(newColorSegment.toLowerCase())}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join("/")}`.replace(/\/+/g, "/");
        const queryParams = queryString ? `?${queryString}` : "";

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: false });
    };

    const resetColors = () => {
        const [path, queryString] = router.asPath.split("?");
        const pathSegments = path.split("/").filter((seg) => seg !== "");

        // Remove the color segment from the path segments
        const newPathSegments = pathSegments.filter((segment) => !segment.startsWith("farbe:"));

        const updatedPath = `/${newPathSegments.join("/")}`.replace(/\/+/g, "/");
        const queryParams = queryString ? `?${queryString}` : "";

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: false });
        setCurrentColors([]); // Clear the current colors state
        setIsOpen(false); // Close the drawer
    };

    if (colors.length === 0) {
        return null;
    }

    return (
        <div className="w-auto">
            <Popover
                className="w-full"
                open={isOpen}
                onOpenChange={(open) => setIsOpen(open)}
            >
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        variant={'outline'}
                        className={`flex  w-full  ${isOpen || currentColors.length > 0 ? "bg-blue-500 text-white" : ""}`}
                    >
                        <span>Farbe</span>
                        {currentColors.length > 0 && (
                            <span className="ml-2 text-xs font-thin">({currentColors.length})</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <ScrollArea className="h-auto w-full">
                        <ul className="grid grid-cols-4 gap-1">
                            {colors.map((item) => {
                                console.log("colors: ", item)
                                    return <li key={item.label} className="relative">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size={"icon"}
                                                    variant="ghost"
                                                    style={{
                                                        backgroundColor: item.code,
                                                        width: "32px",
                                                        height: "32px",
                                                        border:  "1px solid #ccc",
                                                        backdropFilter: item.code ? "none" : "blur(10px)",
                                                        WebkitBackdropFilter: item.code ? "none" : "blur(10px)",
                                                        backgroundClip: "padding-box",
                                                        borderRadius: "50%",
                                                        opacity: item.code ? "1" : "0.7",
                                                    }}
                                                    onClick={() => handleColorClick(item)}
                                                    className={`relative ${currentColors.some((c) => c.label === item.label.toLowerCase()) ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                                                >
                                                    <span className="sr-only">{item.label}</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>{capitalize(item.label)} ({item.count})</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                }
                            )}
                        </ul>
                    </ScrollArea>
                    <div className={'w-full flex justify-center'}>
                        <Button variant="link" onClick={resetColors}>Zurücksetzen</Button>
                    </div>

                </PopoverContent>
            </Popover>
        </div>
    );
};

const colorMap: Record<string, string> = {
    "bunt": "#000000",
    "gelb": "#FFFF00",
    "grau": "#808080",
    "violett": "#8F00FF",
    "blau": "#0000FF",
    "schwarz": "#000000",
    "türkis": "#40E0D0",
    "rot": "#FF0000",
    "grün": "#008000",
    "silber": "#C0C0C0",
    "gold": "#FFD700",
    "rosa": "#FFC0CB",
    "bronze": "#CD7F32",
    "weiss": "#FFFFFF",
    "orange": "#FFA500",
    "transparent": "transparent", // Set to 'transparent' as there's no color code
    "braun": "#5b3a29",
    "beige": "#d9b99b",
    "no-color": "transparent", // Set to 'transparent' as there's no color code
};
