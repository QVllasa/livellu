import Header from './header';
import Footer from './footer';
import {ChevronRight, ChevronUp} from "lucide-react";
import React, {Suspense, useEffect, useState} from "react";

import PageSizeSelector from "@/components/filters/desktop/page-size-selector";
import PageSortSelector from "@/components/filters/desktop/page-sort-selector";
import {Button} from "@/shadcn/components/ui/button";
import {PriceRangeFilter} from "@/components/filters/desktop/price-range-filter";
import {ColorFilter} from "@/components/filters/desktop/color-filter";
import {MaterialFilter} from "@/components/filters/desktop/material-filter";
import {ShapeFilter} from "@/components/filters/desktop/shape-filter";
import {DeliveryTimeFilter} from "@/components/filters/desktop/delivery-time-filter";
import {StyleFilter} from "@/components/filters/desktop/style-filter";
import {HeightFilter} from "@/components/filters/desktop/height-filter";
import {DepthFilter} from "@/components/filters/desktop/depth-filter";
import {WidthFilter} from "@/components/filters/desktop/width-filter";
import {useRouter} from "next/router";
import {SearchFilter} from "@/components/filters/search-filter";
import {SearchBreadcrumbs} from "@/components/breadcrumbs/search-breadcrumbs";
import Image from "next/image";

import dynamic from "next/dynamic";

const Drawer = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.Drawer), { ssr: false });
const DrawerClose = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerClose), { ssr: false });
const DrawerTrigger = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerTrigger), { ssr: false });
const DrawerTitle = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerTitle), { ssr: false });
const DrawerHeader = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerHeader), { ssr: false });
const DrawerFooter = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerFooter), { ssr: false });
const DrawerContent = dynamic(() => import('@/shadcn/components/ui/drawer').then(mod => mod.DrawerContent), { ssr: false });

const MobileColorFilter = dynamic(() => import('@/components/filters/mobile/mobile-color-filter'));
const MobileDeliveryTimeFilter = dynamic(() => import('@/components/filters/mobile/mobile-delivery-time-filter'));
const MobileDepthFilter = dynamic(() => import('@/components/filters/mobile/mobile-depth-filter'));
const MobileHeightFilter = dynamic(() => import('@/components/filters/mobile/mobile-height-filter'));
const MobileMaterialFilter = dynamic(() => import('@/components/filters/mobile/mobile-material-filter'));
const MobileShapeFilter = dynamic(() => import('@/components/filters/mobile/mobile-shape-filter'));
const MobileStyleFilter = dynamic(() => import('@/components/filters/mobile/mobile-style-filter'));
const MobilePriceRangeFilter = dynamic(() => import('@/components/filters/mobile/mobile-price-range-filter/mobile-price-range-filter'));
const BrandFilter = dynamic(() => import('@/components/filters/desktop/brand-filter'));
// Dynamically load the FilterDrawer component even though it is defined in the same file
const FilterDrawer = dynamic(() => Promise.resolve(FilterDrawerComponent), { ssr: false });


function ShopResultsPageLayout(page) {
    const {total, meta, filters, merchant} = page.children.props;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showStickyFilterButton, setShowStickyFilterButton] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState('TITLE');
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    console.log(merchant)


    useEffect(() => {
        const handleScroll = () => {
            const topBarHeight = document.querySelector('header')?.offsetHeight || 0;
            if (window.scrollY > topBarHeight) {
                setShowStickyFilterButton(true);
            } else {
                setShowStickyFilterButton(false);
            }

            // Show the Scroll to Top button after scrolling down 300px
            if (window.scrollY > 300) {
                setShowScrollToTop(true);
            } else {
                setShowScrollToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        if (router.query.search) {
            const searchTerms = router.query.search.length > 0 ? router.query.search.split(" ") : [];
            const t = `Suchergebnisse für: "${searchTerms.join(" ")}"`
            setTitle(t)
        } else {
            setTitle('Deine Suche')
        }
    }, [router.query]);

    const handleResetFilters = () => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);

        // Retain only the 'search' query parameter
        const updatedQuery = {search: router.query.search};

        const cleanedPathSegments = pathSegments.filter(segment => !segment.includes('=') && !segment.includes(':'));
        const cleanedPath = `/${cleanedPathSegments.join('/')}`;


        // Rebuild the URL with the cleaned path and preserved 'search' query parameter
        const newUrl = `${cleanedPath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;


        // Navigate to the cleaned path
        router.replace(newUrl);
    };

    const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
    const hasFilters = pathSegments.some(segment => segment.includes('=') || segment.includes(':'));


    useEffect(() => {
        const handleScroll = () => {
            const topBarHeight = document.querySelector('header')?.offsetHeight || 0;
            if (window.scrollY > topBarHeight) {
                setShowStickyFilterButton(true);
            } else {
                setShowStickyFilterButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMoreFilters = () => {
        setShowMoreFilters(prevState => !prevState);
    };


    return (
        <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150 relative">
            <div className={'relative bg-white h-full w-full z-30'}>
                <Header/>
            </div>

            <div className="min-h-screen max-w-screen-3xl w-full relative mx-auto ">
                <div className="flex flex-col">
                    <div className={'flex flex-col w-full relative '}>
                        <div className={'p-4 lg:p-6'}>
                            <SearchFilter/>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-12 w-full px-4 lg:px-6 gap-4">
                            <div className={'h-auto col-span-3 '}>
                                <Image
                                    className=" w-full object-contain"
                                    src={(process.env.NEXT_PUBLIC_STRAPI_HOST ?? '') + merchant.logo_image?.data?.attributes?.url ?? ''}
                                    alt={merchant.name ?? ''}
                                    width={merchant.logo_image?.data?.attributes?.width}
                                    height={merchant.logo_image?.data?.attributes?.height}
                                /></div>
                            <div className={'h-auto col-span-9'}>
                                <div className="bg-white py-16">
                                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                                Möbel von OTTO DE – Dein Stil, Dein Zuhause
                                            </h1>
                                            <div className="mt-6 grid max-w-xl grid-cols-1 gap-6 text-base leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2">
                                                <div>
                                                    <p>
                                                        Willkommen im Möbel-Paradies von <span class="font-semibold">OTTO DE</span>! Hier findest du alles, was dein Zuhause zu einem echten Wohlfühlort macht. Egal ob du auf der Suche nach
                                                        einem gemütlichen Sofa bist, auf dem du dich nach einem langen Tag entspannen kannst, oder einem stylischen Esstisch, an dem du mit Freunden und Familie zusammenkommst – OTTO bietet
                                                        dir die perfekte Auswahl an Möbeln, die zu deinem Lebensstil passen.
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>
                                                        OTTO denkt nicht nur an Design, sondern auch an Komfort und Funktionalität. Ob für dein Bad, die Küche oder das Kinderzimmer – bei OTTO findest du Möbel, die nicht nur praktisch sind,
                                                        sondern auch richtig gut aussehen. Vom Kleiderschrank, der all deine Lieblingsteile organisiert, bis hin zu cleveren Aufbewahrungslösungen.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <span className={'col-span-full font-light text-xs text-gray-500'}>
                                {total >= 1000 ? 'mehr als 1000 Produkte gefunden' : `${meta?.total == 10000 ? 'über 10000 ' : meta?.total} Produkte gefunden`}
                            </span>
                        </div>

                    </div>


                    {/*Mobile */}
                    <div className={'flex lg:hidden p-4 lg:p-6 w-screen sticky top-0 bg-gray-100 z-40 '}>
                        <div className={'flex overflow-scroll gap-2 '}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <MobileColorFilter type={'single'} meta={meta}/>
                                <MobileDeliveryTimeFilter type={'single'} meta={meta}/>
                                <MobileDepthFilter type={'single'} meta={meta}/>
                                <MobileHeightFilter type={'single'} meta={meta}/>
                                <MobileMaterialFilter type={'single'} meta={meta}/>
                                <MobileShapeFilter type={'single'} meta={meta}/>
                                <MobileStyleFilter type={'single'} meta={meta}/>
                                <MobilePriceRangeFilter type={'single'} meta={meta}/>
                            </Suspense>

                        </div>
                        <div className="absolute flex items-center justify-center bottom-0 right-0 top-0 h-full w-12 bg-gradient-to-r from-transparent to-gray-100 pointer-events-none">
                            <ChevronRight className={'h-6 w-6 text-gray-500'}/>
                        </div>
                    </div>

                    {/*Desktop*/}
                    <div className={'hidden lg:flex h-auto sticky top-0 z-10 border-b bg-gray-100 p-4 lg:px-6'}>
                        <div className={'flex'}>
                            <div className={'grid grid-cols-6 gap-2'}>
                                {/*TODO SUSPENSE ERROR */}
                                {/*<Suspense fallback={<div>Loading...</div>}>*/}
                                {/*    <BrandFilter filters={filters}/>*/}
                                {/*</Suspense>*/}
                                <ColorFilter meta={meta}/>
                                <DeliveryTimeFilter meta={meta}/>
                                <PriceRangeFilter meta={meta}/>
                                <ShapeFilter meta={meta}/>
                                <StyleFilter meta={meta}/>
                                {showMoreFilters && (
                                    <>
                                        <WidthFilter meta={meta}/>
                                        <DepthFilter meta={meta}/>
                                        <HeightFilter meta={meta}/>
                                        <MaterialFilter meta={meta}/>
                                        {/*TODO does not work */}
                                        {/*<PromotionFilter/>*/}
                                    </>
                                )}
                            </div>


                            <Button size={'sm'} onClick={toggleMoreFilters} variant="link" className="ml-auto">
                                {showMoreFilters ? 'Weniger Filter' : 'Weitere Filter'}
                            </Button>
                        </div>

                        {hasFilters && (
                            <Button size={'sm'} onClick={handleResetFilters} variant="link" className="ml-auto">
                                Auswahl zurücksetzen
                            </Button>
                        )}
                    </div>
                    <main className="flex flex-1 flex-col p-4 lg:px-6">
                        <div className={'w-full hidden lg:flex justify-between items-center'}>
                            <SearchBreadcrumbs/>
                            <div className={'flex gap-4'}>
                                <PageSizeSelector/>
                                <PageSortSelector/>
                            </div>

                        </div>
                        <div className={'w-full  flex justify-between lg:hidden items-center p-0 '}>
                            <SearchBreadcrumbs/>
                        </div>
                        {page.children}
                    </main>

                </div>
                <div className={`rounded-t-lg bg-white fixed bottom-0 h-24 z-50 w-full sm:hidden ${showStickyFilterButton ? 'block' : 'hidden'}`}>
                    <div className={'relative flex justify-center items-center h-full px-4'}>
                        <Suspense>
                            <FilterDrawer meta={meta} setIsDrawerOpen={setIsDrawerOpen}/>
                        </Suspense>

                    </div>
                </div>
            </div>
            <Footer/>
            {showScrollToTop && (
                <Button
                    onClick={scrollToTop}
                    size={'icon'}
                    variant={'outline'}
                    className="fixed bottom-[15%] right-4 shadow-lg bg-blue-500 text-white"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className={'h-4 w-4'}/>
                </Button>
            )}

        </div>
    );
}

export const getShopResultsLayout = (page: React.ReactElement, layoutProps: any) => <ShopResultsPageLayout {...layoutProps}>{page}</ShopResultsPageLayout>;

const FilterDrawerComponent = ({setIsDrawerOpen, meta}: { setIsDrawerOpen: any, meta: any }) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant={'outline'} className={'w-full bg-blue-500 text-white'} onClick={() => setIsDrawerOpen(true)}>
                    Filter
                </Button>
            </DrawerTrigger>
            <DrawerContent className={'h-2/3'}>
                <div className={'h-full relative flex flex-col py-3'}>
                    <DrawerHeader>
                        <DrawerTitle>Alle Filter</DrawerTitle>
                    </DrawerHeader>
                    <div className={'grid grid-cols-1 h-full overflow-auto p-4 gap-x-6 '}>
                        <MobileColorFilter type={'multi'} meta={meta}/>
                        <MobileDeliveryTimeFilter type={'multi'} meta={meta}/>
                        <MobileDepthFilter type={'multi'} meta={meta}/>
                        <MobileHeightFilter type={'multi'} meta={meta}/>
                        <MobileMaterialFilter type={'multi'} meta={meta}/>
                        <MobileShapeFilter type={'multi'} meta={meta}/>
                        <MobileStyleFilter type={'multi'} meta={meta}/>
                        <MobilePriceRangeFilter type={'multi'} meta={meta}/>
                    </div>
                    <DrawerFooter className={''}>
                        <DrawerClose asChild>
                            <Button variant="outline">Schließen</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ShopResultsPageLayout;
