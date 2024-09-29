import {useAtom} from "jotai/index";
import {allCategoriesAtom} from "@/store/filters";
import * as React from "react";
import {useEffect, useState} from "react";
import {CategoryCard} from "@/components/categories/category-card";
import {Category} from "@/types";
import {XScrollable} from "@/components/ui/x-scrollable";

function shuffleCategories(categories: Category[]): Category[] {
    for (let i = categories.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [categories[i], categories[j]] = [categories[j], categories[i]];
    }
    return categories;
}

export const CategorySection = () => {
    const [allCategories] = useAtom<Category[]>(allCategoriesAtom)
    const [shuffledCategories, setShuffledCategories] = useState<Category[]>([]);

    // shuffle by index in array

    useEffect(() => {
        setShuffledCategories(shuffleCategories(allCategories))
    }, [allCategories]);




    return <>
        <div className="hidden px-4 sm:px-0 mx-auto max-w-screen-3xl mt-16 lg:grid  gap-8 sm:mt-20  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
            {allCategories.map((category) => <CategoryCard category={category} key={category.id}/>)}
        </div>
        <div className={'lg:hidden '}>
            <XScrollable>
                {allCategories.map((category) => (
                    <div key={category.id} className={'scroll-ml-6 px-1 sm:px-2 md:px-3 snap-center w-36 sm:w-40 md:w-48 shrink-0'}>
                        <CategoryCard category={category}/>
                    </div>
                ))}
            </XScrollable>
        </div>
    </>
}



