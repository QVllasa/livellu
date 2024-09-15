import {useAtom} from "jotai/index";
import {allCategoriesAtom} from "@/store/filters";
import * as React from "react";
import {useRef} from "react";
import Autoplay from "embla-carousel-autoplay";
import {CategoryCard} from "@/components/categories/category-card";
import {Button} from "@/shadcn/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const CategorySection = () => {
    const [allCategories] = useAtom(allCategoriesAtom)

    const plugin = React.useRef(
        Autoplay({delay: 1500})
    )


    return <>
        <div className="hidden px-4 sm:px-0 mx-auto max-w-screen-3xl mt-16 lg:grid  gap-8 sm:mt-20  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
            {allCategories.map((category) => <CategoryCard category={category} key={category.id}/>)}
        </div>
        <div className={'lg:hidden '}>
            <Scrollable>
                {allCategories.map((category) => (
                    <div key={category.id} className={'scroll-ml-6 px-1 sm:px-2 md:px-3 snap-center w-36 sm:w-40 md:w-48 shrink-0'}>
                        <CategoryCard category={category}/>
                    </div>
                ))}
            </Scrollable>
        </div>
        <Scrollable>
            {allCategories.map((category) => {
                    return category.child_categories.map((childCategory) => {
                            if (!childCategory?.image) return;
                            return (<Link href={`/${category.slug}/${childCategory.slug}`} key={childCategory.id} className={'scroll-ml-6 px-1 sm:px-2 md:px-3 snap-center w-36 sm:w-40 md:w-48 shrink-0 flex justify-center items-center'}>
                                <div className={'relative flex flex-col justify-center items-center text-xs lg:text-base'}>
                                    <Image
                                        src={(childCategory?.image ? process.env.NEXT_PUBLIC_STRAPI_HOST + childCategory?.image.url : '/img/background.webp')}
                                        width={childCategory?.image?.width ?? 500}
                                        height={childCategory?.image?.height ?? 500}
                                        alt=""
                                        className=" inset-0 h-full w-full object-cover"/>
                                    <span> {childCategory.name}</span>
                                </div>
                            </Link>)
                        }
                    )

                }
            )}
        </Scrollable>
    </>
}


const Scrollable = ({children}) => {
    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({left: -100, behavior: "smooth"});
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({left: 100, behavior: "smooth"});
        }
    };

    return <>
        <div className={'relative flex  items-center justify-center mt-6 lg:mt-12 w-full px-12'}>
            <div className="relative flex w-auto mx-auto overflow-x-auto scroll-pr-36 scroll-pl-36 pr-26 py-4 snap-x snap-mandatory " ref={scrollContainerRef}>
                {children}
            </div>
            <Button size={'icon'} variant={'outline'} className={'absolute left-0 z-20 '} onClick={scrollLeft}>
                <ChevronLeft className={'w-4 h-4'}/>
            </Button>
            <Button size={'icon'} variant={'outline'} className={'absolute right-0 z-20 '} onClick={scrollRight}>
                <ChevronRight className={'w-4 h-4'}/>
            </Button>
        </div>
    </>
}
