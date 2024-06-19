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
import {fetchCategoryBySlug} from "@/framework/category.ssr";


export const CategoryFilter = () => {
        const [categoriesToDisplay, setCategoriesToDisplay] = useState<Category[]>([]);
        const [searchTerm, setSearchTerm] = useState('');
        const [openItem, setOpenItem] = useState("item-1");
        const [loading, setLoading] = useState(false);

        const router = useRouter();
        const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
        const [allCategories] = useAtom(allCategoriesAtom);

    useEffect(() => {
        console.log("Current category: ", currentCategory)
    }, [currentCategory]);


        useEffect(() => {
            const [pathSegments, queryString] = getPath()
            fetchCategory(getSlug(pathSegments));
        }, [router.asPath, router.query]);

        useEffect(() => {
            if (!currentCategory) {
                setCategoriesToDisplay(allCategories);

                setSearchTerm('');
            }
        }, [currentCategory, allCategories]);

        useEffect(() => {
            if (currentCategory) {
                let categories: Category[] = [];
                categories = getCategoriesToDisplay(currentCategory);



                setCategoriesToDisplay(categories);
                setSearchTerm('');
                setLoading(false);  // Stop loading once categories are set
            }
        }, [currentCategory, router.asPath, router.query]);


        const getParentCategory = (category: any): Category => {
            const cat: Category = {
                id: category?.parent_categories?.data[0].id,
                ...category?.parent_categories?.data[0].attributes
            };
            return cat;
        }

        const fetchCategory = async (slug: string) => {
            if (!slug) return;
            const fetchedCategory = await fetchCategoryBySlug(slug);
            setCurrentCategory(fetchedCategory);
        };


        const getChildren = (category: Category) => {
            return category?.child_categories?.data.map((item) => ({
                id: item.id,
                ...item.attributes,
            })) || [];
        }

        const getCategoriesToDisplay = (category: Category) => {
            let categories: Category[] = [];
            if (category?.child_categories?.data.length !== 0) {
                categories = getChildren(category);
            } else if (category?.child_categories?.data?.length === 0 && category?.parent_categories?.data?.length > 0) {
                const parent: Category = getParentCategory(category);
                categories = getChildren(parent);
            }
            return categories;
        }

        const getPath = () => {
            const [path, queryString] = router.asPath.split('?');
            const pathSegments = path.split('/').filter(seg => seg !== '' && seg !== 'moebel');
            return [pathSegments, queryString];
        }

        const getSlug = (pathSegments) => {
            return pathSegments.find(el => el?.startsWith('category-'));
        }


        const handleCategoryClick = async (category: Category) => {
            setLoading(true);  // Start loading when a category click is initiated
            const [pathSegments, queryString] = getPath();
            const categoryIndex = pathSegments?.findIndex(el => el?.startsWith('category-'));

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

        const handleSearchSelect = (event) => {
            const value = event.target.value;
            console.log("Search value: ", value)
            setSearchTerm(value);
            let categories = getCategoriesToDisplay(currentCategory);
            console.log("Search categories: ", categories)
            if (value === '') {
                setCategoriesToDisplay(categories);
                return;
            }
            const filteredCategories = categories.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
            setCategoriesToDisplay(filteredCategories);
        };


        return (
            <div className="w-64 p-4">
                <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <h4 className="text-sm font-medium">Kategorie</h4>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="w-full mb-4">
                                <Input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={handleSearchSelect}
                                />
                            </div>
                            <ScrollArea className="max-h-64 overflow-auto">
                                <ul>
                                    {categoriesToDisplay?.length > 0 &&
                                        categoriesToDisplay.map((item) => (
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
