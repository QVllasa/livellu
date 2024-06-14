import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Input} from "@/shadcn/components/ui/input";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";
import {useAtom} from "jotai";
import {Category} from "@/types";
import {allCategoriesAtom, currentCategoryAtom} from "@/store/filters";
import {arrangePathSegments} from "@/lib/utils";


export const CategoryFilter = () => {
        const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
        const [originalCategories, setOriginalCategories] = useState<Category[]>([]);
        const [childCategories, setChildCategories] = useState<Category[]>([]);
        const [searchTerm, setSearchTerm] = useState('');
        const [openItem, setOpenItem] = useState("item-1");

        const router = useRouter();
        const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
        const [currentOriginalCategory, setOriginalCategory] = useState<Category | null>(null);
        const [allCategories] = useAtom(allCategoriesAtom);

        useEffect(() => {
            if (!currentCategory) {
                setFilteredCategories(allCategories);
                setChildCategories(allCategories);
                setOriginalCategories([]);
                setSearchTerm('');
            }
        }, [currentCategory, allCategories]);

        useEffect(() => {
            if (currentCategory) {
                const categoriesToDisplay = currentCategory.child_categories?.data.map((item) => ({
                    id: item.id,
                    ...item.attributes,
                })) || [];

                const originalCategoriesToDisplay = currentCategory.original_categories?.data.map((item) => ({
                    id: item.id,
                    ...item.attributes,
                })) || [];

                setChildCategories(categoriesToDisplay);
                setFilteredCategories(categoriesToDisplay);
                setOriginalCategories(originalCategoriesToDisplay);
                setSearchTerm('');
            }
        }, [currentCategory]);


        const handleCategoryClick = async (category: Category) => {
            const [path, queryString] = router.asPath.split('?');
            const pathSegments = path.split('/').filter(seg => seg !== '' && seg !== 'moebel');

            const categoryIndex = pathSegments.findIndex(el => el?.startsWith('category-'));

            if (categoryIndex !== -1) {
                if (currentCategory?.slug === category.slug) {
                    pathSegments.splice(categoryIndex, 1); // Remove the category if it is clicked again
                    setCurrentCategory(null);
                } else {
                    pathSegments[categoryIndex] = `${category.slug.toLowerCase()}`;
                    setCurrentCategory(category);
                }
            } else {
                pathSegments.unshift(`${category.slug.toLowerCase()}`);
                setCurrentCategory(category);
            }

            // Sort segments after
            const sortedPathSegments = arrangePathSegments(pathSegments);

            const updatedPath = `/moebel/${sortedPathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
            const queryParams = queryString ? `?${queryString}` : '';

            router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: false});
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

        const handleOriginalCategoryClick = (category) => {
            const currentQuery = {...router.query};
            const categorySlug = category.name;

            if (currentQuery.category === categorySlug) {
                // Remove the category if it's already in the query
                delete currentQuery.category;
                setOriginalCategory(null);
            } else {
                // Add or replace the category
                currentQuery.category = categorySlug;
                setOriginalCategory(category);
            }

            router.push({
                pathname: router.pathname,
                query: currentQuery,
            });
        };


        return (
            <div className="w-64 p-4">
                <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <h4 className="text-sm font-medium">Kategorie:</h4>
                        </AccordionTrigger>
                        <AccordionContent>
                            {childCategories?.length > 1 && (
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
                                    {filteredCategories?.length > 0 ?
                                        filteredCategories.map((item) => (
                                            <li key={item.id} className="mb-1">
                                                <Button
                                                    size={'sm'}
                                                    variant={currentCategory?.slug === item.slug ? null : 'outline'}
                                                    onClick={() => handleCategoryClick(item)}
                                                    className={`w-full ${currentCategory?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}
                                                    disabled={currentCategory?.slug === item.slug}
                                                >
                                                    {capitalize(item.name)}
                                                </Button>
                                            </li>
                                        ))
                                        :
                                        originalCategories?.map((item) => (
                                            <li key={item.id} className="mb-1">
                                                <Button
                                                    size={'sm'}
                                                    variant={currentOriginalCategory?.name === item.name ? null : 'outline'}
                                                    onClick={() => handleOriginalCategoryClick(item)}
                                                    className={`w-full ${currentOriginalCategory?.name === item.name ? 'bg-blue-500 text-white' : ''}`}
                                                >
                                                    {capitalize(item.name)}
                                                </Button>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    }
;
