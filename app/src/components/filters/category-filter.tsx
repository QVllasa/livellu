import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/components/ui/accordion";
import { capitalize } from "lodash";
import { useAtom } from "jotai";
import {Category, Entity} from "@/types";
import { allCategoriesAtom, currentCategoryAtom } from "@/store/filters";
import { findCategoryBySlug } from "@/framework/utils/find-by-slug";
import {fetchAllCategories} from "@/framework/category.ssr";

export const CategoryFilter = () => {

    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [childCategories, setChildCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    // const [allCategories] = useAtom(allCategoriesAtom);
    const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
    const [allCategories] = useAtom(allCategoriesAtom);


    console.log("allCategories: ", allCategories)
    console.log("currentCategory: ", currentCategory)

    useEffect(() => {
        // Extract the current category from the route
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const categorySlug = pathSegments.find(segment => segment.startsWith('category-'));

        if (!categorySlug) {
            setFilteredCategories(allCategories);
            setChildCategories(allCategories);
            setCurrentCategory(null);
            setSearchTerm(''); // Clear the input
            return;
        }


        if (!currentCategory) {
            setFilteredCategories(allCategories);
            setChildCategories(allCategories);
            setCurrentCategory(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        // Determine the categories to display
        const categoriesToDisplay = currentCategory.child_categories?.data?.length ?
            currentCategory.child_categories.data.filter((item: Entity<Category>) => item.attributes.isCategory).map((item: Entity<Category>) => ({ id: item.id, ...item.attributes })) : [currentCategory];

        // Set the filtered categories
        setChildCategories(categoriesToDisplay);
        setFilteredCategories(categoriesToDisplay);
        setSearchTerm(''); // Clear the input


        setCurrentCategory(currentCategory);
    }, [router.asPath, router.query, allCategories, currentCategory]);

    const handleCategoryClick = (category: Category) => {
        const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");

        const categoryIndex = pathSegments.findIndex(segment => segment.startsWith('category-'));

        if (categoryIndex !== -1) {
            if (currentCategory?.slug === category.slug) {
                pathSegments.splice(categoryIndex, 1); // Remove the category if it is clicked again
                setCurrentCategory(null);
            } else {
                pathSegments[categoryIndex] = `${category.slug.toLowerCase()}`;
                setCurrentCategory(category);
            }
        } else {
            pathSegments.push(`${category.slug.toLowerCase()}`);
            setCurrentCategory(category);
        }

        const updatedPath = `/${pathSegments.join('/')}`.replace(/\/+/g, '/');
        router.push(updatedPath, undefined, { scroll: false });
    };

    const handleSearchSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '') {
            setFilteredCategories(childCategories);
            setSearchTerm('');
            return;
        }
        setSearchTerm(value);
        setFilteredCategories(childCategories.filter((item: Category) => item.name.toLowerCase().includes(value.toLowerCase())));
    };

    return (
        <div className="w-64 p-4">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-medium">Kategorie:
                            {/*<span className={'font-bold'}>*/}
                            {/*    {capitalize(currentCategory?.name) ?? 'undefined'}*/}
                            {/*</span>*/}
                        </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        {childCategories.length > 1 && (
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
                                {filteredCategories.map((item) => (
                                    <li key={item.id} className="mb-1">
                                        <Button
                                            size={'sm'}
                                            variant={currentCategory?.slug === item.slug ? null : 'outline'}
                                            onClick={() => handleCategoryClick(item)}
                                            className={`w-full ${currentCategory?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}
                                            disabled={currentCategory?.slug === item.slug} // Disable the button if it is the selected category
                                        >
                                            {capitalize(item.name)}
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
