import type {NextPageWithLayout} from '@/types';
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {scroller} from 'react-scroll';
import HomeLayout from '@/components/layouts/_home';
import Image from "next/image";
import {SearchFilter} from "@/components/filters/search-filter";
import {Button} from "@/shadcn/components/ui/button";

const Home: NextPageWithLayout = () => {
    const {query} = useRouter();

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
            {/* Hero card */}
                <div className="relative">
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white"/>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
                            <div className="absolute inset-0">
                                <Image
                                    alt="Moderne Möbel in einem stilvollen Wohnzimmer"
                                    src="/img/background.webp"
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
                                    <SearchFilter/>
                                </div>
                                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                                    <div className="space-y-4 sm:mx-auto">
                                        <Button variant={'default'} size={'lg'}  className={'bg-blue-700 text-white'}>
                                            Jetzt einkaufen
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="bg-gray-100 h-72">
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
