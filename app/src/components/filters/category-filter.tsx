import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Input} from "@/shadcn/components/ui/input";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";
import {Category} from "@/types";
import {arrangePathSegments} from "@/lib/utils";
import {fetchCategories} from "@/framework/category.ssr";
import {useAtom} from "jotai";
import {currentCategoryAtom} from "@/store/filters";

export const CategoryFilter = ({all, current}) => {
    const [categoriesToDisplay, setCategoriesToDisplay] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");
    const [loading, setLoading] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(current);
    const [allCategories, setAllCategories] = useState<Category[]>(all);
    const [categoryAtom,  setCategoryAtom] = useAtom(currentCategoryAtom)

    const router = useRouter();


    useEffect(() => {
        setCurrentCategory(current)
        setCategoryAtom(current)
    }, [current]);


    useEffect(() => {
        if (!currentCategory) {
            setCategoriesToDisplay(allCategories);
            setSearchTerm('');
        }
    }, [currentCategory, allCategories]);

    useEffect(() => {
        if (currentCategory) {
            setLoading(true);
             getCategoriesToDisplay(currentCategory).then(categories => {
                setCategoriesToDisplay(categories);
                setSearchTerm('');
                setLoading(false);
             })
        }
    }, [currentCategory, router.asPath, router.query]);

    const getParentCategory = async (category: any) => {
        return await fetchCategories({ slug: category?.parent_categories[0]?.slug });
    };

    const getCategoriesToDisplay = async (category: Category) => {
        if (category?.child_categories?.length !== 0) {
            return category.child_categories;
        } else {
            const parent = await getParentCategory(category);
            return parent[0].child_categories;
        }
    };

    const getPath = () => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '' && seg !== 'moebel');
        return [pathSegments, queryString];
    };

    const getSlug = (pathSegments) => {
        return pathSegments.find(el => el?.startsWith('category-'));
    };

    const handleCategoryClick = async (category: Category) => {
        setLoading(true);
        const [pathSegments, queryString] = getPath();
        const categoryIndex = pathSegments?.findIndex(el => el?.startsWith('category-'));

        if (category?.slug === currentCategory?.slug) {
            // Fetch parent category if the same category is clicked again
            const fetchedCategory = await fetchCategories({slug: category.slug});
            const parentCategory = await getParentCategory(fetchedCategory[0]);
            // setCurrentCategory(parentCategory[0]);
            const parentSlug = parentCategory[0].slug;
            if (categoryIndex !== -1) {
                pathSegments[categoryIndex] = parentSlug.toLowerCase();
            }
        } else {
            if (categoryIndex !== -1) {
                pathSegments[categoryIndex] = category.slug.toLowerCase();
            } else {
                pathSegments.unshift(category.slug.toLowerCase());
            }
            // setCurrentCategory(category);
        }

        const sortedPathSegments = arrangePathSegments(pathSegments);
        const updatedPath = `/moebel/${sortedPathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: false});
    };

    const handleSearchSelect = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        let categories = await getCategoriesToDisplay(currentCategory);
        if (value === '') {
            setCategoriesToDisplay(categories);
            return;
        }
        const filteredCategories = categories.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
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
                        <ScrollArea className="h-64 max-h-64 overflow-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                </div>
                            ) : (
                                <ul>
                                    {categoriesToDisplay?.length > 0 && categoriesToDisplay.map((item) => (
                                        <li key={item.id} className="mb-1">
                                            <Button
                                                size={'sm'}
                                                variant={currentCategory?.slug === item.slug ? null : 'outline'}
                                                onClick={() => handleCategoryClick(item)}
                                                className={`w-full ${currentCategory?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}
                                            >
                                                {capitalize(item.name)}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
