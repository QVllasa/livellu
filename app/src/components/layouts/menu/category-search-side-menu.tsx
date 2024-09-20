import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Button} from "@/shadcn/components/ui/button";
import {capitalize} from "lodash";
import {Category} from "@/types";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {fetchCategories} from "@/framework/category.ssr";

export const CategorySearchSideMenu = () => {
    const router = useRouter();
    const { search } = router.query;
    const [categories, setCategories] = useState<Category[]>([]);

    const handleCategoryClick = (category: Category) => {
        console.log("Selected category:", category);
        // Implement navigation or state update as needed
    };

    const fetchData = async () => {
        if (!router.isReady) return;
        try {
            // Fetch categories with or without the search term
            const response = await fetchCategories(
                search ? { search: search as string, level: [1, 2, 3], limit: 12 } : {level: [1, 2, 3], limit: 12}
            );
            setCategories(response ? response : []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, router.asPath]);

    useEffect(() => {
    }, [categories]);

    return (
        <div className="w-auto">
            <ScrollArea className="h-80">
                <ul>
                    {categories && categories.length > 0 ? (
                        categories.map((category) => (
                            <li key={category.id} className="mb-1">
                                <Button
                                    size="sm"
                                    onClick={() => handleCategoryClick(category)}
                                    variant="outline"
                                    className="flex justify-start w-full mr-4"
                                >
                                    {capitalize(category.name)}
                                </Button>
                            </li>
                        ))
                    ) : (
                        <p>Keine Kategorien gefunden.</p>
                    )}
                </ul>
            </ScrollArea>
        </div>
    );
};
