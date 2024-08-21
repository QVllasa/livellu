import Header from './header';
import Footer from './footer';
import Link from "next/link";
import {Package2} from "lucide-react";
import {capitalize} from "lodash";
import React, {Suspense, useEffect, useState} from "react";
import {CategoryFilter} from "@/components/filters/category-filter";
import {SearchFilter} from "@/components/filters/search-filter";
import PageSizeSelector from "@/components/filters/page-size-selector";
import PageSortSelector from "@/components/filters/page-sort-selector";
import {Breadcrumbs} from "@/components/breadcrumbs/breadcrumbs";
import {Category} from "@/types";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shadcn/components/ui/drawer";
import {Button} from "@/shadcn/components/ui/button";
import {PriceRangeFilter} from "@/components/filters/price-range-filter";
import {ColorFilter} from "@/components/filters/color-filter";
import {MaterialFilter} from "@/components/filters/material-filter";
import {useAtom} from "jotai";
import {currentBrandAtom, currentCategoryAtom, currentColorAtom, currentMaterialAtom} from "@/store/filters";
import {BrandFilter} from "@/components/filters/brand-filter";
import {ShapeFilter} from "@/components/filters/shape-filter";
import {DeliveryTimeFilter} from "@/components/filters/delivery-time-filter";
import {StyleFilter} from "@/components/filters/style-filter";
import {HeightFilter} from "@/components/filters/height-filter";
import {DepthFilter} from "@/components/filters/depth-filter";
import {WidthFilter} from "@/components/filters/width-filter";


function ResultsPageLayout(page) {
    const {initialCategory, total, meta} = page.children.props;
    const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
    const [currentColor, setCurrentColor] = useAtom(currentColorAtom);
    const [currentMaterial, setCurrentMaterial] = useAtom(currentMaterialAtom);
    const [currentBrand, setCurrentBrand] = useAtom(currentBrandAtom);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showStickyFilterButton, setShowStickyFilterButton] = useState(false);



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

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
            <Header/>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-auto items-center border-b p-6 lg:px-4">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Package2 className="h-6 w-6"/>
                                <span className="">{capitalize(currentCategory?.name ?? 'Moebel')}</span>
                            </Link>
                        </div>
                        <div className="flex-1">
                            <Suspense fallback={<div>Loading...</div>}>
                                <div className={'w-64 p-4'}>
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <CategoryFilter />
                                        <BrandFilter />
                                        <ShapeFilter meta={meta} /> {/* Pass the meta prop to ShapeFilter */}
                                        <DeliveryTimeFilter meta={meta} />
                                        <StyleFilter meta={meta} />
                                        <MaterialFilter meta={meta} />
                                        <HeightFilter meta={meta} />
                                        <DepthFilter meta={meta} />
                                        <WidthFilter meta={meta} />
                                        <ColorFilter meta={meta} />


                                        {/* Other filters like ColorFilter */}
                                    </Suspense>
                                </div>
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <header className="flex h-auto items-center gap-4 border-b bg-muted/40 p-4 lg:px-6 ">
                        <SearchFilter/>
                        <div className="lg:hidden relative">
                            <FilterDrawer initialCategory={initialCategory} setIsDrawerOpen={setIsDrawerOpen}/>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        <div className="flex items-center justify-between hidden lg:block">
                            <div>
                                {/*<h1 className="text-lg font-semibold md:text-2xl">{title}</h1>*/}
                                <span className={'font-light text-xs text-gray-500'}>
                                    {total >= 1000 ? 'mehr als 1000 Produkte gefunden' : `${total} Produkte gefunden`}
                                </span>
                            </div>
                            <div className={'flex gap-4 justify-center'}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <PageSizeSelector/>
                                    <PageSortSelector/>
                                </Suspense>
                            </div>
                        </div>
                        <Suspense fallback={<div>Loading Breadcrumbs...</div>}>
                            <Breadcrumbs initialCategory={initialCategory}/>
                        </Suspense>
                        {page.children}
                    </main>
                </div>
                <div className={`rounded-t-lg bg-white fixed bottom-0 h-24 z-50 w-full sm:hidden ${showStickyFilterButton ? 'block' : 'hidden'}`}>
                    <div className={'relative flex justify-center items-center h-full px-4'}>
                        <FilterDrawer initialCategory={initialCategory} setIsDrawerOpen={setIsDrawerOpen}/>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export const getResultsLayout = (page: React.ReactElement, layoutProps: any) => <ResultsPageLayout {...layoutProps}>{page}</ResultsPageLayout>

const FilterDrawer = ({setIsDrawerOpen, initialCategory}: { setIsDrawerOpen: any, initialCategory: Category | null }) => {
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
                        <CategoryFilter initialCategory={initialCategory}/>
                        <PriceRangeFilter/>
                        <ColorFilter/>
                        {/*<MaterialFilter/>*/}
                    </div>
                    <DrawerFooter className={''}>
                        <DrawerClose asChild>
                            <Button variant="outline">Schließen</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
};

export default ResultsPageLayout;
