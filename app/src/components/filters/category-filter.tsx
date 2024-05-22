import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/components/ui/accordion";
import { capitalize } from "lodash";
import { useAtom } from "jotai";
import { Category } from "@/types";
import { allCategoriesAtom, currentCategoryAtom } from "@/store/category";

// Helper function to find category by slug in the nested structure
const findCategoryBySlug = (categories, slug) => {
    for (const category of categories) {
        if (category.slug?.toLowerCase() === slug || category.attributes?.slug?.toLowerCase() === slug) {
            return { id: category.id, ...category };
        }
        if (category.child_categories?.data?.length) {
            const found = findCategoryBySlug(category.child_categories.data, slug);
            if (found) {
                return { id: found.id, ...found.attributes };
            }
        }
    }
    return null;
};

export const CategoryFilter = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [childCategories, setChildCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [allCategories] = useAtom(allCategoriesAtom);
    const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);

    useEffect(() => {
        // Extract the current category from the route
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const categorySlug = pathSegments.find(segment => findCategoryBySlug(allCategories, segment.toLowerCase()));

        console.log("pathSegments: ", pathSegments);
        console.log("categorySlug: ", categorySlug);

        if (!categorySlug) {
            console.log("no category slug found");
            setFilteredCategories(allCategories);
            setChildCategories(allCategories);
            setCurrentCategory(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        // Find the current category using the original nested structure
        const currentCategory = findCategoryBySlug(allCategories, categorySlug.toLowerCase());

        if (!currentCategory) {
            console.log("no current category found");
            setFilteredCategories(allCategories);
            setChildCategories(allCategories);
            setCurrentCategory(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        // Determine the categories to display
        const categoriesToDisplay = currentCategory.child_categories?.data?.length ?
            currentCategory.child_categories.data.map(item => ({ id: item.id, ...item.attributes })) : [currentCategory];

        // Set the filtered categories
        setChildCategories(categoriesToDisplay);
        setFilteredCategories(categoriesToDisplay);
        setSearchTerm(''); // Clear the input

        console.log("categoriesToDisplay: ", categoriesToDisplay);

        setCurrentCategory(currentCategory);
        setSelectedCategory(currentCategory);
    }, [router.asPath, router.query, allCategories]);

    const handleCategoryClick = (category: Category) => {
        const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");

        console.log("pathSegments: ", pathSegments);
        console.log("category: ", category);

        const updatedPathSegments = pathSegments.filter(segment => !allCategories.some(cat => cat.slug.toLowerCase() === segment));
        const updatedPath = `/${[...updatedPathSegments, category.slug.toLowerCase()].join('/')}`.replace(/\/+/g, '/');

        setCurrentCategory(category);
        setSelectedCategory(category);
        router.push(updatedPath);
    };

    const handleSearchSelect = (event) => {
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
                        <h4 className="text-sm font-medium">Kategorie{': '}
                            <span className={'font-bold'}>
                                {capitalize(currentCategory?.name)}
                            </span>
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
                                            variant={selectedCategory?.slug === item.slug ? 'solid' : 'outline'}
                                            onClick={() => handleCategoryClick(item)}
                                            className={`w-full ${selectedCategory?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}
                                            disabled={selectedCategory?.slug === item.slug} // Disable the button if it is the selected category
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
