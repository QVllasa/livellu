import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Button} from "@/shadcn/components/ui/button";
import {capitalize} from "lodash";
import {Category} from "@/types";
import {ChevronDownIcon, ChevronRightIcon, EnvelopeOpenIcon} from "@radix-ui/react-icons";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";

export const CategorySideMenu = ({initialCategory}) => {
    const router = useRouter();
    const {params} = router.query;

    const [categoryLevel0, setCategoryLevel0] = useState<Category | null>(null);
    const [categoryLevel1, setCategoryLevel1] = useState<Category | null>(null);
    const [categoryLevel2, setCategoryLevel2] = useState<Category | null>(null);
    const [categoryLevel3, setCategoryLevel3] = useState<Category | null>(null); // New state for third level

    const [openItem, setOpenItem] = useState("item");
    const [openItem0, setOpenItem0] = useState("item-0");
    const [openItem1, setOpenItem1] = useState("item-1");
    const [openItem2, setOpenItem2] = useState("item-2"); // Accordion control for level 3

    useEffect(() => {
        setCategoryLevel0(initialCategory);
    }, [initialCategory, router.query, router.asPath]);

    useEffect(() => {
        if (params && params.length > 1 && params[1] && categoryLevel0) {
            const level1Category = categoryLevel0.child_categories.find(el => el.slug === params[1]);
            setCategoryLevel1(level1Category || null);
        } else {
            setCategoryLevel1(null);
        }
    }, [params, categoryLevel0]);

    useEffect(() => {
        if (params && params.length > 2 && params[2] && categoryLevel1) {
            const level2Category = categoryLevel1.child_categories.find(el => el.slug === params[2]);
            setCategoryLevel2(level2Category || null);
        } else {
            setCategoryLevel2(null);
        }
    }, [params, categoryLevel1]);

    useEffect(() => {
        if (params && params.length > 3 && params[3] && categoryLevel2) {
            const level3Category = categoryLevel2.child_categories.find(el => el.slug === params[3]);
            setCategoryLevel3(level3Category || null);
        } else {
            setCategoryLevel3(null);
        }
    }, [params, categoryLevel2]);

    const handleCategoryClick = (category: Category) => {
        let pathSegments = [categoryLevel0?.slug];

        if (category.level === 1) {
            if (categoryLevel1?.slug === category.slug) {
                pathSegments = [categoryLevel0?.slug];
                setCategoryLevel1(null);
            } else {
                pathSegments.push(category.slug);
                setCategoryLevel1(category);
            }
        } else if (category.level === 2) {
            if (categoryLevel2?.slug === category.slug) {
                pathSegments = [categoryLevel0?.slug, categoryLevel1?.slug];
                setCategoryLevel2(null);
            } else {
                pathSegments.push(categoryLevel1?.slug, category.slug);
                setCategoryLevel2(category);
            }
        } else if (category.level === 3) {
            if (categoryLevel3?.slug === category.slug) {
                pathSegments = [categoryLevel0?.slug, categoryLevel1?.slug, categoryLevel2?.slug];
                setCategoryLevel3(null);
            } else {
                pathSegments.push(categoryLevel1?.slug, categoryLevel2?.slug, category.slug);
                setCategoryLevel3(category);
            }
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`;
        router.push(updatedPath);
    };

    return (
        <div className="w-auto">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item">
                    <AccordionTrigger>
                        <h4 className="mb-3 text-sm font-semibold text-lg">Kategorie</h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="h-[65vh]">
                            <Accordion type="single" collapsible className="w-full mb-6" value={openItem0} onValueChange={setOpenItem0}>
                                {categoryLevel0 && (
                                    <AccordionItem value="item-0">
                                        <Button
                                            size="sm"
                                            onClick={() => handleCategoryClick(categoryLevel0)}
                                            variant="outline"
                                            className="flex justify-between w-full mb-1 transition-all mr-4"
                                        >
                                            <div className="flex justify-start">
                                                <EnvelopeOpenIcon className="mr-2 h-4 w-4"/>
                                                {capitalize(categoryLevel0.name)}
                                            </div>
                                        </Button>
                                        <AccordionContent>
                                            {categoryLevel0.child_categories && categoryLevel0.child_categories.length > 0 && (
                                                <ul>
                                                    {categoryLevel0.child_categories.map(child0 => {
                                                        if (categoryLevel1?.child_categories?.length > 0 && categoryLevel1?.slug && categoryLevel1.slug !== child0.slug) return;
                                                        return (
                                                            <li key={child0.id} className="mb-1 pl-6">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleCategoryClick(child0)}
                                                                    variant="outline"
                                                                    className={`flex justify-start w-full mr-4 ${categoryLevel1?.slug === child0.slug ? 'bg-blue-500 text-white' : ''}`}
                                                                >

                                                                    {capitalize(child0.name)}
                                                                    {child0.child_categories?.length > 0 && child0 === categoryLevel1 ? (
                                                                        <ChevronDownIcon className="ml-auto h-4 w-4"/>
                                                                    ) : (child0?.child_categories?.length > 0 && <ChevronRightIcon className="ml-auto h-4 w-4"/>)
                                                                    }
                                                                </Button>
                                                                {categoryLevel1?.slug === child0.slug && categoryLevel1.child_categories?.length > 0 && (
                                                                    <Accordion type="single" collapsible className="w-full" value={openItem1} onValueChange={setOpenItem1}>
                                                                        <AccordionItem value="item-1">
                                                                            <AccordionContent>
                                                                                <ul>
                                                                                    {categoryLevel1?.child_categories.map(child1 => {
                                                                                        if (categoryLevel2?.child_categories?.length > 0 && categoryLevel2?.slug && categoryLevel2.slug !== child1.slug) return;
                                                                                        return (
                                                                                            <li key={child1.id} className="mb-1 pl-6">
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    onClick={() => handleCategoryClick(child1)}
                                                                                                    variant="outline"
                                                                                                    className={`flex justify-start w-full mr-4 ${categoryLevel2?.slug === child1.slug ? 'bg-blue-500 text-white' : ''}`}
                                                                                                >

                                                                                                    {capitalize(child1.name)}
                                                                                                    {(child1?.child_categories?.length > 0 && child1 === categoryLevel2) ? (
                                                                                                        <ChevronDownIcon className="ml-auto h-4 w-4"/>
                                                                                                    ) : (child1?.child_categories?.length > 0 && <ChevronRightIcon className="ml-auto h-4 w-4"/>)
                                                                                                    }
                                                                                                </Button>
                                                                                                {categoryLevel2?.slug === child1.slug && categoryLevel2.child_categories?.length > 0 && (
                                                                                                    <Accordion type="single" collapsible className="w-full" value={openItem2} onValueChange={setOpenItem2}>
                                                                                                        <AccordionItem value="item-2">
                                                                                                            <AccordionContent>
                                                                                                                <ul>
                                                                                                                    {categoryLevel2?.child_categories.map(child2 => {
                                                                                                                        if (categoryLevel3?.child_categories?.length > 0 && categoryLevel3?.slug && categoryLevel3.slug !== child2.slug) return;
                                                                                                                        return <li key={child2.id} className="mb-1 pl-6">
                                                                                                                            <Button
                                                                                                                                size="sm"
                                                                                                                                onClick={() => handleCategoryClick(child2)}
                                                                                                                                variant="outline"
                                                                                                                                className={`flex justify-start w-full mr-4 ${categoryLevel3?.slug === child2.slug ? 'bg-blue-500 text-white' : ''}`}
                                                                                                                            >
                                                                                                                                {capitalize(child2.name)}
                                                                                                                            </Button>
                                                                                                                        </li>
                                                                                                                    })}
                                                                                                                </ul>
                                                                                                            </AccordionContent>
                                                                                                        </AccordionItem>
                                                                                                    </Accordion>
                                                                                                )}
                                                                                            </li>
                                                                                        );
                                                                                    })}
                                                                                </ul>
                                                                            </AccordionContent>
                                                                        </AccordionItem>
                                                                    </Accordion>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                )}
                            </Accordion>
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-gray-100 pointer-events-none"></div>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
