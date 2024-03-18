import Link from "next/link";
import {Article} from "@/types";

export const ArticleCard = ({article}: { article: Article }) => {

    return <article
        key={article.id}
        className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
    >
        <img src={(process.env.NEXT_PUBLIC_STRAPI_HOST ?? '') + '' + article?.featured_image?.data?.attributes.url} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover"/>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"/>
        <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"/>


        <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
            <Link href={'/articles/' + article.slug}>
                <span className="absolute inset-0"/>
                {article.title}
            </Link>
        </h3>
    </article>
}