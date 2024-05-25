import type {NextPageWithLayout} from '@/types';
import {Suspense, useEffect} from 'react';
import {useRouter} from 'next/router';
import {Element, scroller} from 'react-scroll';
import HomeLayout from '@/components/layouts/_home';
import {useWindowSize} from '@/lib/use-window-size';
import {useType} from '@/framework/type';
import {BackgroundDiagonalLines} from "@/components/backgrounds/background-diagonal-lines";
import {Button} from "@/shadcn/components/ui/button";
import {Merchants} from "@/components/merchants/merchants";
import BannerShort from "@/components/banners/banner-short";
import {useCategories} from "@/framework/category";
import {CategoryCard} from "@/components/categories/category-card";
import {useAtom} from "jotai/index";
import {allCategoriesAtom} from "@/store/category";



const Home: NextPageWithLayout = () => {
    const {query} = useRouter();
    const {width} = useWindowSize();
    const {type} = useType();
    // const [allCategories] = useAtom(allCategoriesAtom);


    // console.log("categories: ", allCategories)


    useEffect(() => {
        if (query.text || query.category) {
            scroller.scrollTo('grid', {
                smooth: true,
                offset: -110,
            });
        }
    }, [query.text, query.category]);

    return (
        <>
            <div className="mx-auto border border-border-200 max-w-7xl justify-center mt-20">
                <BannerShort />
            </div>

            <BackgroundDiagonalLines/>
            <Divider title={'Magazin'}/>
            {/*<Suspense>*/}
            {/*    {allCategories.map((category, index) => (*/}
            {/*        <>*/}
            {/*            <Element name="grid" className="grid  max-w-7xl mx-auto gap-8">*/}
            {/*                <div className="relative py-12">*/}
            {/*                    <div className="mx-auto  max-w-7xl ">*/}
            {/*                        <div className="relative mx-auto max-w-2xl lg:mx-0">*/}
            {/*                            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-4xl">{category.name}</h2>*/}
            {/*                            <p className="mt-2 text-base leading-8 text-gray-600">*/}
            {/*                                {category.summary}*/}
            {/*                            </p>*/}
            {/*                        </div>*/}
            {/*                        /!*<div className="mx-auto mt-4 grid max-w-2xl auto-rows-fr grid-cols-1 gap-2 sm:mt-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">*!/*/}
            {/*                        /!*    {category.child_categories?.data.map((category, index) => (*!/*/}
            {/*                        /!*        <CategoryCard key={category.id} category={category.attributes}/>*!/*/}
            {/*                        /!*    ))}*!/*/}

            {/*                        /!*</div>*!/*/}
            {/*                        <div className={'relative flex justify-start mt-12'}>*/}
            {/*                            <Button>Mehr</Button>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </Element>*/}
            {/*        </>*/}


            {/*    ))}*/}
            {/*</Suspense>*/}


            <Divider title={'Unsere Partnershops'}/>
            <Merchants/>
        </>
    );
};

Home.getLayout = function getLayout(page) {
    return <HomeLayout>{page}</HomeLayout>;
};

export default Home;


const Divider = ({title}: {title: string}) => {

    return <div className="relative mt-12 z-10">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300"/>
        </div>
        <div className="relative flex justify-center">
            <span className="bg-white px-2 text-xl text-gray-500">{title}</span>
        </div>
    </div>
}
