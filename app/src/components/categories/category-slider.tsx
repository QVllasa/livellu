import {useAtom} from "jotai/index";
import {allCategoriesAtom} from "@/store/filters";
import * as React from "react";
import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {Category} from "@/types";
import {XScrollable} from "@/components/ui/x-scrollable";
import {useRouter} from "next/router";

function shuffleCategories(categories: Category[]): Category[] {
    for (let i = categories.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [categories[i], categories[j]] = [categories[j], categories[i]];
    }
    return categories;
}

export const CategorySlider = ({showAll = false}: { showAll: boolean }) => {
    const [allCategories] = useAtom<Category[]>(allCategoriesAtom)
    const [shuffledCategories, setShuffledCategories] = useState<Category[]>([]);
    const router = useRouter();

    const {params} = router.query;

    useEffect(() => {
        console.log("categoryslider: ", params)
        if (!params) {
            setShuffledCategories(allCategories)
        }
        else if (params.length === 0) {
            setShuffledCategories([])
        } else {
            console.log(params)
            setShuffledCategories(allCategories.filter((category) => category.slug === params[0]))
        }
    }, [allCategories, router.query, params]);

    if (shuffledCategories.length === 0) return null;

    return <>
        <div className={'relative w-full h-36 sm:h-44 md:h-56 '}>
            <div className={'absolute left-0 right-0 flex   items-start w-auto px-4 lg:px6  mx-auto'}>
                <XScrollable>
                    {shuffledCategories.map((category) => {
                            return category?.child_categories.map((childCategory) => {
                                    if (!childCategory?.hasImage && !showAll) return;
                                    return (
                                        <Link href={`/${category.slug}/${childCategory.slug}`} key={childCategory.id} className={'scroll-ml-6  snap-center  shrink-0 flex justify-center items-center'}>

                                            <div className={'relative flex flex-col justify-center items-center text-xs lg:text-base h-32 w-32 sm:h-40 sm:w-40'}>
                                                <Image
                                                    src={(childCategory?.image ? process.env.NEXT_PUBLIC_STRAPI_HOST + childCategory?.image.url : '/img/background.webp')}
                                                    width={300}
                                                    height={300}
                                                    alt=""
                                                    className=" inset-0  object-cover rounded-xl border border-white h-28 w-28 sm:h-36 sm:w-36 "/>
                                                <p className={'flex overflow-hidden text-[0.65rem] sm:text-xs text-ellipsis'}>{childCategory.name}</p>
                                            </div>
                                        </Link>)
                                }
                            )

                        }
                    )}
                </XScrollable>
            </div>
        </div>
    </>
}



