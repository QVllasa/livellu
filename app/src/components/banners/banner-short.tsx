import {Navigation, Swiper, SwiperSlide} from '@/components/ui/slider';
import type {ArticleCategory} from '@/types';

import Image from 'next/image';
import {useArticleCategories} from "@/framework/article";
import {Button} from "@/shadcn/components/ui/button";
import Link from "next/link";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {FALLBACK_IMG} from "@/lib/constants";


const BannerShort = () => {


    const filterArticleCategories = {
        filters: {
            is_featured: {
                $eq: true
            }
        },
        populate: '*'
    }

    // const{articleCategories} = useArticleCategories(filterArticleCategories);
    const {articleCategories} = useArticleCategories(filterArticleCategories);


    return (
        <div className="relative">
            <div className="-z-1 overflow-hidden">
                <div className="relative ">
                    <Swiper
                        id="banner"
                        className="rounded "
                        loop={true}
                        modules={[Navigation]}
                        resizeObserver={true}
                        allowTouchMove={false}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.next',
                            prevEl: '.prev',
                        }}
                    >
                        {articleCategories?.map((articleCategory, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="relative h-full max-h-[240px] w-full md:max-h-[450px]">
                                    <Slide articleCategory={articleCategory}/>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Button variant="outline" size="icon"
                            className={'prev absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-200 transition-all duration-200 ltr:left-4 rtl:right-4 md:-mt-5 ltr:md:left-5 rtl:md:right-5'}>
                        <ChevronLeftIcon className="h-4 w-4"/>
                    </Button>

                    <Button variant="outline" size="icon"
                            className={'next absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-200 transition-all duration-200 ltr:right-4 rtl:left-4 md:-mt-5 ltr:md:right-5 rtl:md:left-5'}>
                        <ChevronRightIcon className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BannerShort;


function Slide({articleCategory}: { articleCategory: ArticleCategory }) {
    const imgObj = articleCategory?.featured_image?.data ? articleCategory?.featured_image?.data.attributes : FALLBACK_IMG

    return (
        <>
            <div className="relative">
                <Image
                    src={process.env.NEXT_PUBLIC_STRAPI_HOST+imgObj.url}
                    alt={articleCategory.title}
                    width={imgObj.width}
                    height={imgObj.height}
                    layout="fill"
                    objectFit="cover"
                    className="absolute z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-dark to-dark opacity-80"></div>
                <div className="px-12 relative">
                    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {articleCategory.title}</h2>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">{articleCategory.description}</p>
                        <div className="mt-10 flex items-center gap-x-6">
                            <Link href={'/article-category' + '/' + articleCategory.slug}><Button>Mehr entdecken</Button></Link>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
