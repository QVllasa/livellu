import Header from './header';
import Footer from './footer';
import Link from "next/link";
import {ChevronUp} from "lucide-react";
import {capitalize} from "lodash";
import React, {Suspense, useEffect, useState} from "react";

import PageSizeSelector from "@/components/filters/desktop/page-size-selector";
import PageSortSelector from "@/components/filters/desktop/page-sort-selector";
import {Button} from "@/shadcn/components/ui/button";
import {PriceRangeFilter} from "@/components/filters/desktop/price-range-filter";
import {ColorFilter} from "@/components/filters/desktop/color-filter";
import {MaterialFilter} from "@/components/filters/desktop/material-filter";
import {useAtom} from "jotai";
import {currentBrandAtom, currentCategoryAtom, currentColorAtom, currentMaterialAtom,} from "@/store/filters";
import {ShapeFilter} from "@/components/filters/desktop/shape-filter";
import {DeliveryTimeFilter} from "@/components/filters/desktop/delivery-time-filter";
import {StyleFilter} from "@/components/filters/desktop/style-filter";
import {HeightFilter} from "@/components/filters/desktop/height-filter";
import {DepthFilter} from "@/components/filters/desktop/depth-filter";
import {WidthFilter} from "@/components/filters/desktop/width-filter";
import {Breadcrumbs} from "@/components/breadcrumbs/breadcrumbs";
import {useRouter} from "next/router";
import {SearchFilter} from "@/components/filters/search-filter";
import {CategorySideMenu} from "@/components/layouts/menu/category-side-menu";

import Icon from "@/components/ui/icon";
import {CategorySlider} from "@/components/categories/category-slider";


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


function ResultsPageLayout(page) {
    const {initialCategory, total, meta, filters} = page.children.props;
    const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
    const [currentColor, setCurrentColor] = useAtom(currentColorAtom);
    const [currentMaterial, setCurrentMaterial] = useAtom(currentMaterialAtom);
    const [currentBrand, setCurrentBrand] = useAtom(currentBrandAtom);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showStickyFilterButton, setShowStickyFilterButton] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState('TITLE');
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [isDeepLevel, setIsDeepLevel] = useState(false);

    useEffect(() => {
        console.log("is deep level:", isDeepLevel)
    }, [isDeepLevel]);

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

    const {params} = router.query;

    useEffect(() => {
        if (params) {
            const level0 = initialCategory[0];
            const level1 = level0?.child_categories.find(el => el.slug === params[1]);
            if (level1) {
                // hide category slider if we are on a deep level like /deko/spiegel
                // show category slider if we are on a top level like /deko
                setIsDeepLevel(true);
            } else {
                setIsDeepLevel(false);
            }
            const level2 = level1?.child_categories.find(el => el.slug === params[2]);
            const level3 = level2?.child_categories.find(el => el.slug === params[3]);
            const path = [level0, level1, level2, level3].filter(Boolean);
            setTitle(path.at(-1)?.name);
        }
    }, [initialCategory, params]);

    const handleResetFilters = () => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const cleanedPathSegments = pathSegments.filter(segment => !segment.includes('=') && !segment.includes(':'));
        const cleanedPath = `/${cleanedPathSegments.join('/')}`;

        // Navigate to the cleaned path
        router.replace(cleanedPath);
    };

    const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
    const hasFilters = pathSegments.some(segment => segment.includes('=') || segment.includes(':'));


    const category = capitalize(currentCategory?.name) ?? 'Moebel';
    const brand = currentBrand && (' von der Marke ' + capitalize(currentBrand?.label));
    const color = currentColor && (' in der Farbe ' + capitalize(currentColor?.label));
    const material = currentMaterial && (' aus ' + capitalize(currentMaterial?.label));

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
        <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150 relative ">
            <div className={'relative bg-white h-full w-full z-30 border-b border-border-200 shadow-sm'}>
                <Header shadowNone={true}/>
            </div>

            <div className="grid min-h-screen w-full lg:grid-cols-[220px_1fr] lg:grid-cols-[auto_1fr] relative ">
                <div className="hidden border-r bg-muted/40 lg:block w-max">
                    <div className="flex h-auto flex-col gap-2 sticky top-0 p-6">
                        <div className="flex flex-col h-auto justify-center items-start border-b pb-5">
                            <Link href="/" className="flex items-center gap-2 font-semibold p-0">
                                <Icon name={initialCategory[0]?.lucide_icon} className="h-5 w-5"/>
                                <span className="">{capitalize(initialCategory[0]?.name ?? 'Moebel')}</span>
                            </Link>
                        </div>
                        <div className="flex-1 max-h-full overflow-scroll min-w-max w-64">
                            <Suspense fallback={<div>Loading...</div>}>
                                <div className={'min-w-max'}>
                                    <CategorySideMenu initialCategory={initialCategory[0]}/>
                                </div>
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 relative ">
                    <div className={'col-span-1 flex flex-col w-full relative p-4 lg:p-6'}>
                        <SearchFilter/>
                    </div>
                    <div className="col-span-1 flex flex-col relative h-auto items-center gap-4 bg-gray-100 px-4 lg:px-6 ">
                        <div className="flex items-center justify-between w-full ">
                            <div>
                                <h1 className="text-lg font-semibold md:text-2xl">{capitalize(title)}</h1>
                                <span className={'font-light text-xs text-gray-500'}>
                                    {total >= 1000 ? 'mehr als 1000 Produkte gefunden' : `${meta?.total == 10000 ? 'über 10000 ' : meta?.total} Produkte gefunden`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {!isDeepLevel &&
                        <Suspense fallback={<div>Loading...</div>}>
                            <CategorySlider showAll={true}/>
                        </Suspense>
                    }


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
                            <Suspense fallback={<div>Loading Breadcrumbs...</div>}>
                                <Breadcrumbs initialCategory={initialCategory[0]}/>
                                <div className={'flex gap-4'}>
                                    <PageSizeSelector/>
                                    <PageSortSelector/>
                                </div>
                            </Suspense>
                        </div>
                        <div className={'w-full  flex justify-between lg:hidden items-center p-0 '}>
                            <Suspense fallback={<div>Loading Breadcrumbs...</div>}>
                                <Breadcrumbs initialCategory={initialCategory[0]}/>
                            </Suspense>
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
                    variant={'outline'}
                    className="fixed bottom-[15%] right-4 shadow-lg"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className={'h-4 w-4'}/>
                </Button>
            )}
        </div>
    );
}

export const getResultsLayout = (page: React.ReactElement, layoutProps: any) => <ResultsPageLayout {...layoutProps}>{page}</ResultsPageLayout>;

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

export default ResultsPageLayout;
