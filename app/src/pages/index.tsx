import {MetaData, NextPageWithLayout, Product} from '@/types';
import * as React from 'react';
import {Suspense} from 'react';
import HomeLayout from '@/components/layouts/_home';
import Image from "next/image";
import {SearchFilter} from "@/components/filters/search-filter";
import {Button} from "@/shadcn/components/ui/button";
import {CategorySection} from "@/components/page-components/home-index/CategorySection";
import {ProductSlider} from "@/components/products/products-slider";
import {fetchProducts} from "@/framework/product";
import {GetServerSidePropsContext} from "next";
import {Merchants} from "@/components/merchants/merchants";
import {CategorySlider} from "@/components/categories/category-slider";


const Home: NextPageWithLayout = ({products, meta}: { products: Product[], meta: MetaData }) => {

    return (
        <>
            <div className={'bg-gray-100 sm:px-6 lg:px-8'}>
                {/* Hero card */}
                <div className="relative w-full">
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white sm:-mx-6 lg:-mx-8"/>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100 sm:-mx-6 lg:-mx-8"/>
                    <div className=" mx-auto max-w-screen-3xl ">
                        <div className="relative  sm:overflow-hidden sm:rounded-2xl">
                            <div className="absolute inset-0">
                                <Image
                                    alt="Moderne Möbel in einem stilvollen Wohnzimmer"
                                    src="/img/background.png"
                                    width={1920}
                                    height={1080}
                                    className="h-full w-full object-cover opacity-80"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white "/>
                            </div>
                            <div className="relative px-6 py-16 sm:py-24 lg:px-8 lg:py-32 z-10">
                                <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                    <span className="text-gray-800">Entdecken Sie Premium-Möbel</span>
                                </h1>
                                <div className={'w-full max-w-3xl my-12 mx-auto'}>
                                    <Suspense fallback={<div>Loading...</div>}> <SearchFilter/></Suspense>

                                </div>
                                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                                    <div className="space-y-4 sm:mx-auto">
                                        <Button variant={'outline'} size={'lg'} className={'bg-blue-500 text-white border-none'}>
                                            Jetzt einkaufen
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 h-full mx-auto relative max-w-screen-3xl">
                    <Divider title={'Alle Kategorien auf einem Blick'}/>
                    <Suspense fallback={<div>Loading...</div>}>
                        <CategorySection/>
                        <div className={'my-12 -mx-6'}>
                            <CategorySlider category={null} showAll={false}/>
                        </div>

                    </Suspense>
                    <Divider title={'Die beliebtesten Produkte'}/>
                    <ProductSlider products={products}/>
                    <Divider title={'Alle Partnershops'}/>
                    <Merchants />
                </div>
            </div>
        </>
    );
};

Home.getLayout = function getLayout(page) {
    return <HomeLayout>{page}</HomeLayout>;
};

export default Home;

const Divider = ({title}: { title: string }) => {
    return (
        <div className="relative mt-12 z-10">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"/>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-gray-100 px-2 text-xl text-gray-500">{title}</span>
            </div>
        </div>
    );
};


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const filters = {
        minPrice: 200,
        maxPrice: 2000,
        minRating: 4.8,
        pageSize: 24,
        randomize: true,
        searchTerms: '',  // Empty query to fetch all matching products
    };

    const {data: products, meta} = await fetchProducts(filters);

    return {
        props: {
            products,
            meta
        },
    };
}

