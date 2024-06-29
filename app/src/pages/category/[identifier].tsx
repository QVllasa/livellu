import HomeLayout from "@/components/layouts/_home";
import {BackgroundSquares} from "@/components/backgrounds/background-squares";
import {BackgroundDiagonalLines} from "@/components/backgrounds/background-diagonal-lines";
import {fetchCategory} from "@/framework/category";
import {ParsedUrlQuery} from 'querystring';
import {GetServerSideProps} from 'next';
import {Category, NextPageWithLayout} from "@/types";

interface IParams extends ParsedUrlQuery {
    identifier: string;
}

interface CategoryPageProps {
    category?: Category; // Optional, da es möglich ist, dass keine Kategorie zurückgegeben wird
    error?: string;
}

const CategoryPage: NextPageWithLayout<CategoryPageProps> = ({category, error}) => {
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
                {/*<div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">*/}
                {/*    {category.article_categories.data.map((articleCategory) => (*/}
                {/*        <ArticleCategoryCard articleCategory={articleCategory.attributes} key={articleCategory.id}/>*/}
                {/*    ))}*/}
                {/*</div>*/}
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{'Alles zum Thema ' + category?.name}</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        {category.content}
                    </p>
                </div>
                {/*<div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">*/}
                {/*    {category?.child_categories?.data.map((childCategory) => (*/}
                {/*        <CategoryCard category={childCategory.attributes} key={childCategory.id}/>*/}
                {/*    ))}*/}
                {/*</div>*/}
            </div>
        </div>
    )
}


// @ts-ignore
export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async (context) => {
    const {identifier} = context.params as IParams;
    try {
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

        const category = await fetchCategory(filter); // Stellen Sie sicher, dass diese Funktion die erwarteten Daten zurückgibt
        if (!category) {
            return {props: {category: undefined}};
        }
        return {props: {category}};
    } catch (error) {
        console.error('Fehler beim Abrufen der Kategorie:', error);
        return {props: {error: error}};
    }
}

CategoryPage.getLayout = function getLayout(page: any) {
    return <HomeLayout>{page}</HomeLayout>;
};


export default CategoryPage;
