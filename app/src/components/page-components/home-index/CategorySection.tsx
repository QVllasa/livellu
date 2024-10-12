import {useAtom} from "jotai/index";
import {allCategoriesAtom} from "@/store/filters";
import * as React from "react";
import {CategoryCard} from "@/components/categories/category-card";
import {Category} from "@/types";
import {XScrollable} from "@/components/ui/x-scrollable";
import Skeleton from "react-loading-skeleton";

function shuffleCategories(categories: Category[]): Category[] {
    for (let i = categories.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [categories[i], categories[j]] = [categories[j], categories[i]];
    }
    return categories;
}

export const CategorySection = () => {
    const [allCategories] = useAtom<Category[]>(allCategoriesAtom)

    if (!allCategories || allCategories.length === 0) {
        return <>
            <div className={'lg:hidden px-4'}>
                <XScrollable>
                    {[...Array(10).keys()].map((i) => (
                        <div key={i} className={'scroll-ml-6 px-1 sm:px-2 md:px-3 snap-center w-36 sm:w-40 md:w-48 shrink-0'}>
                            <Skeleton className={'relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-white px-8 pb-8 pt-20 sm:pt-28 md:pt-32  lg:pt-36 xl:pt-48 max-h-48'}/>
                        </div>
                    ))}
                </XScrollable>
            </div>
            <div className={'hidden px-4 sm:px-0 mx-auto max-w-screen-3xl mt-16 lg:grid  gap-8 sm:mt-20  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-'}>
                {[...Array(10).keys()].map((i) => (
                    <Skeleton key={i} className={'relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-white px-8 pb-8 pt-20 sm:pt-28 md:pt-32  lg:pt-36 xl:pt-48 max-h-48'}/>
                ))}


            </div>
        </>

    }


    return <>
        <div className="hidden px-4 sm:px-0 mx-auto max-w-screen-3xl mt-16 lg:grid  gap-8 sm:mt-20  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
            {allCategories.map((category) => <CategoryCard category={category} key={category.id}/>)}
        </div>
        <div className={'lg:hidden px-4'}>
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



