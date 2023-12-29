import {Navigation, Swiper, SwiperSlide} from '@/components/ui/slider';
import {useIsRTL} from '@/lib/locals';
import {ArrowNext, ArrowPrev} from '@/components/icons';
import {useTranslation} from 'next-i18next';
import type {Banner} from '@/types';

import Image from 'next/image';


const BannerShort = () => {
    const {t} = useTranslation('common');
    const {isRTL} = useIsRTL();

    const banners: Banner[] = [
        {
            id: "1",
            title: 'Neue Dimensionen des Wohnens',
            description: 'Entdecken Sie moderne und stilvolle Möbeltrends.',
            imageUrl: '/slider/slider1.png',

        },
        {
            id: "2",
            title: "Wohnkultur neu definiert",
            description: 'Finden Sie Möbel, die Ihre Persönlichkeit widerspiegeln.',
            imageUrl: '/slider/slider2.png',
        },
        {
            id: "3",
            title: "Nachhaltigkeit trifft Design",
            description: 'Schaffen Sie ein umweltbewusstes Zuhause mit Stil.',
            imageUrl: '/slider/slider3.png',
        }
    ]


    return (
        <div className="relative">
            <div className="-z-1 overflow-hidden">
                <div className="relative ">
                    <Swiper
                        id="banner"
                        className="rounded bg-transparent"
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
                        {banners?.map((banner, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="relative h-full max-h-[240px] w-full md:max-h-[450px]">
                                    <Slide banner={banner}/>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div
                        className="prev absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-200 transition-all duration-200 ltr:left-4 rtl:right-4 md:-mt-5 ltr:md:left-5 rtl:md:right-5"
                        role="button"
                    >
                        <span className="sr-only">{t('text-previous')}</span>

                        {isRTL ? (
                            <ArrowNext width={18} height={18}/>
                        ) : (
                            <ArrowPrev width={18} height={18}/>
                        )}
                    </div>
                    <div
                        className="next absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-200 transition-all duration-200 ltr:right-4 rtl:left-4 md:-mt-5 ltr:md:right-5 rtl:md:left-5"
                        role="button"
                    >
                        <span className="sr-only">{t('text-next')}</span>
                        {isRTL ? (
                            <ArrowPrev width={18} height={18}/>
                        ) : (
                            <ArrowNext width={18} height={18}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerShort;


function Slide({banner}: { banner: Banner }) {
    return (
        <>
            <div className="relative">
                <Image
                    src={banner.imageUrl ?? ''}
                    alt={banner.title}
                    layout="fill"
                    objectFit="cover"
                    className="absolute z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-dark to-dark opacity-80"></div>
                <div className="px-12 relative">
                    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {banner.title}</h2>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">{banner.description}</p>
                        <div className="mt-10 flex items-center gap-x-6">
                            <a href="#"
                               className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white
                           shadow-sm hover:bg-indigo-500 focus-visible:outline
                           focus-visible:outline-2 focus-visible:outline-offset-2
                           focus-visible:outline-indigo-600">
                                Jetzt shoppen</a>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
