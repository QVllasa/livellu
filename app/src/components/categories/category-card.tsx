import Link from "next/link";
import {Category} from "@/types";
import Image from "next/image";

export const CategoryCard = ({category}: { category: Category }) => {

    const imgObj = category?.image

    return <article
            key={category.id}
            className="relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-white px-8 pb-8 pt-20 sm:pt-28 md:pt-32  lg:pt-36 xl:pt-48 max-h-48"
        >
            <Image
                src={(category?.image ? process.env.NEXT_PUBLIC_STRAPI_HOST+category?.image.url : '/img/background.webp')}
                width={imgObj?.width ?? 500}
                height={imgObj?.height ?? 500}
                alt=""
                className="absolute inset-0 -z-10 h-full w-full object-cover"/>
            <h3 className="absolute left-0 top-0 right-0 flex text-xs sm:text-sm md:text-base  xl:text-xl font-bold leading-6 text-gray-800 justify-start bg-gradient-to-b from-white to-80%  bg-opacity-80  w-auto p-2 md:p-3 lg:p-4 pb-20 sm:pb-28 md:pb-32  lg:pb-36 xl:pb-48 ">
                <Link href={'/' + category.slug}>
                    {category.name}
                </Link>
            </h3>
        </article>
}
