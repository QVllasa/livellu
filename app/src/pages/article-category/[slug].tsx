import HomeLayout from "@/components/layouts/_home";
import {useRouter} from "next/router";
import {useArticleCategory} from "@/framework/article";
import Link from "next/link";
import {BackgroundSquares} from "@/components/backgrounds/background-squares";


const ArticleCateogryPage = () => {
    const router = useRouter();
    const {slug} = router.query;

    if (!slug) {
        return <div>Loading...</div>
    }


    const filter = {
        filters: {
            slug: {
                $eq: slug
            }
        },
        populate: {
            articles: {
                populate: '*'
            },

        }
    };
    const {articleCategory, loading, error} = useArticleCategory(filter);


    if (!articleCategory) {
        return <div>Loading...</div>
    }


    return (
        <div className="relative isolate overflow-hidden bg-white py-24 sm:py-32 -mt-14">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <BackgroundSquares/>
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{articleCategory.title}</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        {articleCategory.description}
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {articleCategory.articles?.data?.map((cat) => (
                        <article
                            key={cat.id}
                            className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
                        >
                            <img src={(process.env.NEXT_PUBLIC_STRAPI_HOST ?? '') + '' + cat?.attributes?.featured_image?.data?.attributes.url} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover"/>
                            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"/>
                            <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"/>


                            <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                                <Link href={'/articles/'+cat?.attributes?.slug}>
                                    <span className="absolute inset-0"/>
                                    {cat?.attributes?.title}
                                </Link>
                            </h3>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}




ArticleCateogryPage.getLayout = function getLayout(page: any) {
    return <HomeLayout>{page}</HomeLayout>;
};


export default ArticleCateogryPage;
