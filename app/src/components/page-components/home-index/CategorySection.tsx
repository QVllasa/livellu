import {useAtom} from "jotai/index";
import {allCategoriesAtom} from "@/store/filters";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {CategoryCard} from "@/components/categories/category-card";
import {Button} from "@/shadcn/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";

export const CategorySection = () => {
    const [allCategories] = useAtom(allCategoriesAtom)
    const plugin = React.useRef(
        Autoplay({delay: 1500})
    )

    return <>
        <div className="hidden px-4 sm:px-0 mx-auto max-w-screen-xl mt-16 lg:grid  gap-8 sm:mt-20  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-5">
            {allCategories.map((category) => <CategoryCard category={category} key={category.id}/>)}
        </div>
        <div className={'relative flex lg:hidden items-center justify-center px-4 mt-6'}>
            <div className="relative flex w-auto mx-auto overflow-x-auto scroll-pr-36 scroll-pl-36 pr-26 snap-x snap-mandatory">
                {allCategories.map((category) => (
                    <div key={category.id} className={'scroll-ml-6 px-1 sm:px-2 md:px-3 snap-center w-36 sm:w-40 md:w-48 shrink-0'}>
                        <CategoryCard category={category}/>
                    </div>
                ))}
            </div>
            <Button size={'icon'} variant={'outline'} className={'absolute left-0 '}>
                <ChevronLeft className={'w-4 h-4'}/>
            </Button>
            <Button size={'icon'} variant={'outline'} className={'absolute right-0 '}>
                <ChevronRight className={'w-4 h-4'}/>
            </Button>
        </div>


    </>
}
