import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Button} from "@/shadcn/components/ui/button";
import {capitalize} from "lodash";
import {Category} from "@/types";
import {ChevronDownIcon, ChevronRightIcon, EnvelopeOpenIcon} from "@radix-ui/react-icons";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {fetchCategories} from "@/framework/category.ssr";


export const CategoryFilter = () => {
    const router = useRouter();
    const {params} = router.query;

    const [categoryLevel0, setCategoryLevel0] = useState<Category | null>(null);
    const [categoryLevel1, setCategoryLevel1] = useState<Category | null>(null);
    const [categoryLevel2, setCategoryLevel2] = useState<Category | null>(null);

    const [openItem, setOpenItem] = useState("item" as string);
    const [openItem0, setOpenItem0] = useState("item-0");
    const [openItem1, setOpenItem1] = useState("item-1");


    useEffect(() => {

        const setCategories = async () => {
            if (params && params.length > 0 && params[0] && !categoryLevel0) {
                const data = await fetchCategories({identifier: params[0]})
                setCategoryLevel0(data[0]);
            }
        }
        setCategories();

    }, [router.query, router.asPath]);

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
            setCategoryLevel2(null);
        } else if (category.level === 2) {
            if (categoryLevel2?.slug === category.slug) {
                pathSegments = [categoryLevel0?.slug, categoryLevel1?.slug];
                setCategoryLevel2(null);
            } else {
                pathSegments.push(categoryLevel1?.slug, category.slug);
                setCategoryLevel2(category);
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
                    <AccordionContent className={''}>
                        <ScrollArea className={'h-[65vh]'}>
                            <Accordion type="single" collapsible className="w-full mb-6" value={openItem0} onValueChange={setOpenItem0}>
                                {categoryLevel0 && (
                                    <AccordionItem value="item-0">
                                        <Button
                                            size={'sm'}
                                            onClick={() => handleCategoryClick(categoryLevel0)}
                                            variant={'outline'}
                                            className={`flex justify-between w-full mb-1 transition-all`}
                                        >
                                            <div className={'flex justify-start'}>
                                                <EnvelopeOpenIcon className="mr-2 h-4 w-4"/>
                                                {capitalize(categoryLevel0.name)}
                                            </div>
                                        </Button>
                                        <AccordionContent>
                                            {categoryLevel0?.child_categories && categoryLevel0?.child_categories.length > 0 && (
                                                <ul>
                                                    {categoryLevel0?.child_categories.map((item) => {
                                                            if (categoryLevel1?.slug && categoryLevel1?.slug !== item.slug) return;
                                                            return <li key={item.id} className="mb-1 pl-6">
                                                                <Button
                                                                    size={'sm'}
                                                                    onClick={() => handleCategoryClick(item)}
                                                                    variant={'outline'}
                                                                    className={`flex justify-start w-full ${categoryLevel1?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}
                                                                >
                                                                    <EnvelopeOpenIcon className="mr-2 h-4 w-4"/>
                                                                    {capitalize(item.name)}
                                                                    {item.child_categories?.length > 0 && item === categoryLevel1 ? (
                                                                        <ChevronDownIcon className="ml-auto h-4 w-4"/>
                                                                    ) : (
                                                                        <ChevronRightIcon className="ml-auto h-4 w-4"/>
                                                                    )}
                                                                </Button>
                                                                {categoryLevel1?.slug === item.slug && categoryLevel1.child_categories?.length > 0 && (
                                                                    <Accordion type="single" collapsible className="w-full" value={openItem1} onValueChange={setOpenItem1}>
                                                                        <AccordionItem value="item-1">

                                                                            <AccordionContent>
                                                                                <ul>
                                                                                    {categoryLevel1?.child_categories.map((child) => (
                                                                                        <li key={child.id} className="mb-1 pl-6">
                                                                                            <Button
                                                                                                size={'sm'}
                                                                                                onClick={() => handleCategoryClick(child)}
                                                                                                variant={'outline'}
                                                                                                className={`flex justify-start w-full ${categoryLevel2?.slug === child.slug ? 'bg-blue-500 text-white' : ''}`}
                                                                                            >
                                                                                                <EnvelopeOpenIcon className="mr-2 h-4 w-4"/>
                                                                                                {capitalize(child.name)}
                                                                                            </Button>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </AccordionContent>
                                                                        </AccordionItem>
                                                                    </Accordion>
                                                                )}
                                                            </li>
                                                        }
                                                    )}
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
