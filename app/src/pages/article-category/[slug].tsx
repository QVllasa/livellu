import HomeLayout from "@/components/layouts/_home";
import {useRouter} from "next/router";
import {useArticleCategory} from "@/framework/article";
import Link from "next/link";
import {BackgroundSquares} from "@/components/backgrounds/background-squares";
import {BackgroundCircles} from "@/components/backgrounds/backgroud-circles";
import {BackgroundDiagonalLines} from "@/components/backgrounds/background-diagonal-lines";
import {BackgroundWaves} from "@/components/backgrounds/backgroud-waves";
import {ArticleCard} from "@/components/article/article-card";


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
                {/*<BackgroundCircles/>*/}
                <BackgroundDiagonalLines/>
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{articleCategory.title}</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        {articleCategory.description}
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {articleCategory.articles?.data?.map((article) => (
                        <ArticleCard article={article.attributes} key={article.id}/>
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
