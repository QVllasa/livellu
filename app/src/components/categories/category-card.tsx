import Link from "next/link";
import {Category} from "@/types";
import {capitalizeFirstLetter} from "@/lib/format-string";
import Image from "next/image";
import {FALLBACK_IMG} from "@/lib/constants";

export const CategoryCard = ({category}: { category: Category }) => {

    console.log("CategoryCard: ", category)

    const imgObj = category?.image?.data ? category?.image?.data.attributes : FALLBACK_IMG
    const provider = category?.image?.data.attributes.provider === "local" ? process.env.NEXT_PUBLIC_STRAPI_HOST : ''

    return <article
        key={category.id}
        className="relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-gray-900 px-8 pb-8  sm:pt-48 lg:pt-48 max-h-48"
    >
        <Image
            src={(provider) + imgObj.url}
            width={imgObj.width}
            height={imgObj.height}
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover"/>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"/>
        <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"/>


        <h3 className="mt-3 text-base font-semibold leading-6 text-white">
            <Link href={'/category/' + category.identifier}>
                <span className="absolute inset-0"/>
                {capitalizeFirstLetter(category.name)}
            </Link>
        </h3>
    </article>
}
