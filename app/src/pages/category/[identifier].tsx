import HomeLayout from "@/components/layouts/_home";
import {useRouter} from "next/router";
import {BackgroundSquares} from "@/components/backgrounds/background-squares";
import {BackgroundDiagonalLines} from "@/components/backgrounds/background-diagonal-lines";
import {fetchCategory} from "@/framework/category";
import {ArticleCategoryCard} from "@/components/article/article-category-card";
import {CategoryCard} from "@/components/categories/category-card";
import {useEffect, useState} from "react";
import {Category} from "@/types";


const CategoryPage = () => {
    const router = useRouter();
    const {identifier} = router.query;
    const [category, setCategory] = useState<Category>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        (async () => {
            if (!identifier) {
                // Frühzeitiger Rückkehr, wenn kein identifier vorhanden ist
                return;
            }

            console.log("identifier: ", identifier)
            // Startet den Ladezustand
            setLoading(true);

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

            // Ersetzen Sie `useCategory` durch Ihre eigene Logik, um die Daten zu fetchen.
            // Angenommen, `fetchCategory` ist eine Funktion, die eine Kategorie basierend auf dem Filter abruft
            fetchCategory(filter).then(data => {
                setCategory(data);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setError(err);
                setLoading(false);
            });
        })();
    }, [identifier])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!category) {
        return <div>Kategorie nicht gefunden.</div>
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
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{'Alles zum Thema ' + category?.name}</h2>
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
