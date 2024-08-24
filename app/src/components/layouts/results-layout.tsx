import Header from './header';
import Footer from './footer';
import Link from "next/link";
import {Package2} from "lucide-react";
import {capitalize} from "lodash";
import React, {Suspense, useEffect, useState} from "react";
import {CategoryFilter} from "@/components/filters/category-filter";
import PageSizeSelector from "@/components/filters/page-size-selector";
import PageSortSelector from "@/components/filters/page-sort-selector";
import {Category} from "@/types";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,} from "@/shadcn/components/ui/drawer";
import {Button} from "@/shadcn/components/ui/button";
import {PriceRangeFilter} from "@/components/filters/price-range-filter";
import {ColorFilter} from "@/components/filters/color-filter";
import {MaterialFilter} from "@/components/filters/material-filter";
import {useAtom} from "jotai";
import {currentBrandAtom, currentCategoryAtom, currentColorAtom, currentMaterialAtom,} from "@/store/filters";
import {BrandFilter} from "@/components/filters/brand-filter";
import {ShapeFilter} from "@/components/filters/shape-filter";
import {DeliveryTimeFilter} from "@/components/filters/delivery-time-filter";
import {StyleFilter} from "@/components/filters/style-filter";
import {HeightFilter} from "@/components/filters/height-filter";
import {DepthFilter} from "@/components/filters/depth-filter";
import {WidthFilter} from "@/components/filters/width-filter";
import {Breadcrumbs} from "@/components/breadcrumbs/breadcrumbs";
import {useRouter} from "next/router";
import PromotionFilter from "@/components/filters/promotion-filter";

function ResultsPageLayout(page) {
    const { initialCategory, total, meta, filters } = page.children.props;
    const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
    const [currentColor, setCurrentColor] = useAtom(currentColorAtom);
    const [currentMaterial, setCurrentMaterial] = useAtom(currentMaterialAtom);
    const [currentBrand, setCurrentBrand] = useAtom(currentBrandAtom);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showStickyFilterButton, setShowStickyFilterButton] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState('TITLE');

    const { params } = router.query;

    useEffect(() => {
        if (params) {
            const level0 = initialCategory[0];
            const level1 = level0?.child_categories.find(el => el.slug === params[1]);
            const level2 = level1?.child_categories.find(el => el.slug === params[2]);
            const path = [level0, level1, level2].filter(Boolean);
            setTitle(path.at(-1)?.name);
        }
    }, [initialCategory, params]);

    const handleResetFilters = () => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const cleanedPathSegments = pathSegments.filter(segment => !segment.includes('=') && !segment.includes(':'));
        const cleanedPath = `/${cleanedPathSegments.join('/')}`;

        // Navigate to the cleaned path
        router.push(cleanedPath);
    };

    const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
    const hasFilters = pathSegments.some(segment => segment.includes('=') || segment.includes(':'));

    console.log("filters ResultsPageLayout: ", filters, meta, currentCategory);

    const category = capitalize(currentCategory?.name) ?? 'Moebel';
    const brand = currentBrand && (' von der Marke ' + capitalize(currentBrand?.label));
    const color = currentColor && (' in der Farbe ' + capitalize(currentColor?.label));
    const material = currentMaterial && (' aus ' + capitalize(currentMaterial?.label));

    console.log("initialCategory ResultsPageLayout: ", initialCategory);

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

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150 relative">
            <div className={'relative bg-white h-full w-full z-30'}>
                <Header />
            </div>

            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-auto flex-col gap-2 sticky top-0 ">
                        <div className="flex flex-col h-auto justify-center items-start border-b p-6 lg:px-4">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Package2 className="h-6 w-6" />
                                <span className="">{capitalize(initialCategory[0]?.name ?? 'Moebel')}</span>
                            </Link>
                        </div>
                        <div className="flex-1 max-h-full overflow-scroll">
                            <Suspense fallback={<div>Loading...</div>}>
                                <div className={'w-64 pl-4'}>
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <CategoryFilter initialCategory={initialCategory[0]} />
                                    </Suspense>
                                </div>
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col ">
                    <div className="flex flex-col h-auto items-center gap-4 bg-gray-100 p-4 lg:px-6 ">
                        <div className="flex items-center justify-between hidden lg:block w-full">
                            <div>
                                <h1 className="text-lg font-semibold md:text-2xl">{capitalize(title)}</h1>
                                <span className={'font-light text-xs text-gray-500'}>
                                    {total >= 1000 ? 'mehr als 1000 Produkte gefunden' : `${meta?.total == 10000 ? 'über 10000 ' : meta?.total} Produkte gefunden`}
                                </span>
                            </div>
                        </div>
                        <div className="lg:hidden relative">
                            <FilterDrawer initialCategory={initialCategory} setIsDrawerOpen={setIsDrawerOpen} />
                        </div>
                    </div>
                    <div className={'flex gap-2 h-auto sticky top-0 z-10 border-b bg-gray-100 p-4 lg:px-6'}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <BrandFilter filters={filters} />
                            <ColorFilter meta={meta} />
                            <DeliveryTimeFilter meta={meta} />
                            <PriceRangeFilter meta={meta} />
                            <ShapeFilter meta={meta} />
                            <StyleFilter meta={meta} />
                            <WidthFilter meta={meta} />
                            <DepthFilter meta={meta} />
                            <HeightFilter meta={meta} />
                            <MaterialFilter meta={meta} />
                            <PromotionFilter/>
                        </Suspense>
                        {hasFilters && (
                            <Button size={'sm'} onClick={handleResetFilters} variant="link" className="ml-auto">
                                Auswahl zurücksetzen
                            </Button>
                        )}
                    </div>
                    <main className="flex flex-1 flex-col p-4 px-6">
                        <div className={'w-full flex justify-between items-center'}>
                            <Suspense fallback={<div>Loading Breadcrumbs...</div>}>
                                <Breadcrumbs initialCategory={initialCategory[0]} />
                                <div className={'flex gap-4'}>
                                    <PageSizeSelector />
                                    <PageSortSelector />
                                </div>
                            </Suspense>
                        </div>
                        {page.children}
                    </main>
                </div>
                <div className={`rounded-t-lg bg-white fixed bottom-0 h-24 z-50 w-full sm:hidden ${showStickyFilterButton ? 'block' : 'hidden'}`}>
                    <div className={'relative flex justify-center items-center h-full px-4'}>
                        <FilterDrawer initialCategory={initialCategory} setIsDrawerOpen={setIsDrawerOpen} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export const getResultsLayout = (page: React.ReactElement, layoutProps: any) => <ResultsPageLayout {...layoutProps}>{page}</ResultsPageLayout>;

const FilterDrawer = ({ setIsDrawerOpen, initialCategory }: { setIsDrawerOpen: any, initialCategory: Category | null }) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className={'w-full'} onClick={() => setIsDrawerOpen(true)}>
                    Filter
                </Button>
            </DrawerTrigger>
            <DrawerContent className={'h-2/3'}>
                <div className={'h-full relative flex flex-col py-3'}>
                    <DrawerHeader>
                        <DrawerTitle>Filter einstellen</DrawerTitle>
                    </DrawerHeader>
                    <div className={'h-full overflow-auto p-4'}>
                        <CategoryFilter />
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
