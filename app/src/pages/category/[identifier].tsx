import HomeLayout from "@/components/layouts/_home";
import {useRouter} from "next/router";
import {useArticleCategory} from "@/framework/article";
import Link from "next/link";
import {BackgroundSquares} from "@/components/backgrounds/background-squares";
import {BackgroundCircles} from "@/components/backgrounds/backgroud-circles";
import {BackgroundDiagonalLines} from "@/components/backgrounds/background-diagonal-lines";
import {BackgroundWaves} from "@/components/backgrounds/backgroud-waves";
import {ArticleCard} from "@/components/article/article-card";
import {useCategories, useCategory} from "@/framework/category";
import {ArticleCategoryCard} from "@/components/article/article-category-card";
import {CategoryCard} from "@/components/categories/category-card";


const CategoryPage = () => {
    const router = useRouter();
    const {identifier} = router.query;

    if (!identifier) {
        return <div>Loading...</div>
    }


    const filter = {
        filters: {
            identifier: {
                $eq: identifier
            }
        },
        populate: {
            child_categories: {
                populate: 'image'
            },
            article_categories: {
                populate: 'featured_image'
            },
            image: {
                populate: '*'
            },

        }
    };
    const {category, loading, error} = useCategory(filter);


    if (!category) {
        return <div>Loading...</div>
    }

    console.log("category: ", category)

    return (
        <div className="relative isolate overflow-hidden bg-white py-24 sm:py-32 -mt-14">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <BackgroundSquares/>
                {/*<BackgroundCircles/>*/}
                <BackgroundDiagonalLines/>
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{category?.name}</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        {category.content}
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {category.article_categories.data.map((articleCategory) => (
                        <ArticleCategoryCard articleCategory={articleCategory.attributes} key={articleCategory.id}/>
                    ))}
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{'Alles zum Thema '+category?.name}</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        {category.content}
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {category?.child_categories?.data.map((childCategory) => (
                        <CategoryCard category={childCategory.attributes} key={childCategory.id}/>
                    ))}
                </div>
            </div>
        </div>
    )
}


CategoryPage.getLayout = function getLayout(page: any) {
    return <HomeLayout>{page}</HomeLayout>;
};


export default CategoryPage;
