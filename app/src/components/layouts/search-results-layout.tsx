import Header from './header';
import Footer from './footer';
import Link from "next/link";
import {ChevronUp} from "lucide-react";
import {capitalize} from "lodash";
import React, {Suspense, useEffect, useState} from "react";

import PageSizeSelector from "@/components/filters/desktop/page-size-selector";
import PageSortSelector from "@/components/filters/desktop/page-sort-selector";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,} from "@/shadcn/components/ui/drawer";
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
import {MobileColorFilter} from "@/components/filters/mobile/mobile-color-filter";
import {MobileDeliveryTimeFilter} from "@/components/filters/mobile/mobile-delivery-time-filter";
import {MobileDepthFilter} from "@/components/filters/mobile/mobile-depth-filter";
import {MobileHeightFilter} from "@/components/filters/mobile/mobile-height-filter";
import {MobileMaterialFilter} from "@/components/filters/mobile/mobile-material-filter";
import {MobileShapeFilter} from "@/components/filters/mobile/mobile-shape-filter";
import {MobileStyleFilter} from "@/components/filters/mobile/mobile-style-filter";
import {MobilePriceRangeFilter} from "@/components/filters/mobile/mobile-price-range-filter/mobile-price-range-filter";
import {SearchBreadcrumbs} from "@/components/breadcrumbs/search-breadcrumbs";
import {CategorySearchSideMenu} from "@/components/layouts/menu/category-search-side-menu";
import Icon from "@/components/ui/icon";


function SearchResultsPageLayout(page) {
    const {total, meta, filters} = page.children.props;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showStickyFilterButton, setShowStickyFilterButton] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState('TITLE');
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };


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

            <div className="grid min-h-screen w-full lg:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative ">
                <div className="hidden border-r bg-muted/40 lg:block">
                    <div className="flex h-auto flex-col gap-2 sticky top-0 p-6">
                        <div className="flex flex-col h-auto justify-center items-start border-b pb-5">
                            <Link href="/" className="flex items-center gap-2 font-semibold p-0">
                                <Icon name={'Search'} className="h-5 w-5"/>
                                <span className="">{'Deine Suche'}</span>
                            </Link>
                        </div>
                        <div className="flex-1 max-h-full overflow-scroll">
                            <div className={'w-64 '}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <CategorySearchSideMenu/>
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col ">
                    <div className={'flex flex-col w-full relative '}>
                        <div className={'p-4 lg:p-6'}>
                            <SearchFilter/>
                        </div>


                    </div>
                    <div className="flex flex-col h-auto items-center gap-4 bg-gray-100 px-4 lg:px-6  ">
                        <div className="flex items-center justify-between w-full ">
                            <div>
                                <h1 className="text-lg font-semibold md:text-2xl">{capitalize(title)}</h1>
                                <span className={'font-light text-xs text-gray-500'}>
                                    {total >= 1000 ? 'mehr als 1000 Produkte gefunden' : `${meta?.total == 10000 ? 'über 10000 ' : meta?.total} Produkte gefunden`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/*Mobile */}
                    <div className={'flex lg:hidden p-4 lg:p-6 w-screen sticky top-0 bg-gray-100 z-40 '}>
                        <div className={'flex overflow-scroll gap-2 '}>
                            <MobileColorFilter type={'single'} meta={meta}/>
                            <MobileDeliveryTimeFilter type={'single'} meta={meta}/>
                            <MobileDepthFilter type={'single'} meta={meta}/>
                            <MobileHeightFilter type={'single'} meta={meta}/>
                            <MobileMaterialFilter type={'single'} meta={meta}/>
                            <MobileShapeFilter type={'single'} meta={meta}/>
                            <MobileStyleFilter type={'single'} meta={meta}/>
                            <MobilePriceRangeFilter type={'single'} meta={meta}/>
                        </div>
                        <div className="absolute flex items-center justify-center bottom-0 right-0 top-0 h-full w-12 bg-gradient-to-r from-transparent to-gray-100 pointer-events-none">

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
                        <FilterDrawer meta={meta} setIsDrawerOpen={setIsDrawerOpen}/>
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

export const getSearchResultsLayout = (page: React.ReactElement, layoutProps: any) => <SearchResultsPageLayout {...layoutProps}>{page}</SearchResultsPageLayout>;

const FilterDrawer = ({setIsDrawerOpen, meta}: { setIsDrawerOpen: any, meta: any }) => {
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

export default SearchResultsPageLayout;
