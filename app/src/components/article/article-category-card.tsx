import Link from "next/link";
import {Article, ArticleCategory} from "@/types";

export const ArticleCategoryCard = ({articleCategory}: { articleCategory: ArticleCategory }) => {

    return <article
        key={articleCategory.id}
        className="relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-gray-900 px-8 pb-8  sm:pt-48 lg:pt-48 max-h-48"
    >
        <img src={(process.env.NEXT_PUBLIC_STRAPI_HOST ?? '') + '' + articleCategory?.featured_image?.data?.attributes.url} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover"/>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"/>
        <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"/>


        <h3 className="mt-3 text-base font-semibold leading-6 text-white">
            <Link href={'/article-category/' + articleCategory.slug}>
                <span className="absolute inset-0"/>
                {articleCategory.title}
            </Link>
        </h3>
    </article>
}
