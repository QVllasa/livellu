import {useAtom} from "jotai/index";
import {allCategoriesAtom} from "@/store/filters";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {CategoryCard} from "@/components/categories/category-card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/shadcn/components/ui/carousel";

export const CategorySection = () => {
    const [allCategories] = useAtom(allCategoriesAtom)
    const plugin = React.useRef(
        Autoplay({ delay: 1500 })
    )

    return <>
        <div className="hidden px-4 sm:px-0 mx-auto max-w-screen-xl mt-16 lg:grid grid-cols-1 gap-8 sm:mt-20 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-5">
            {allCategories.map((category) => <CategoryCard category={category} key={category.id}/>)}
        </div>
        <Carousel opts={{
            align: "start",
            loop: true,
        }} plugins={[plugin.current]} className="px-4 lg:hidden mx-auto max-w-screen-lg mt-12 relative">
            <CarouselContent>
                {allCategories.map((category) => (
                    <CarouselItem key={category.id} className={'basis-1/3 md:basis-1/4'}>
                        <div className="">
                            <CategoryCard category={category}/>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className={'left-0'}/>
            <CarouselNext className={'right-0'}/>
        </Carousel>
    </>
}
