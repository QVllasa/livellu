import Logo from '@/components/ui/logo';
import cn from 'classnames';
import {useIsHomePage} from '@/lib/use-is-homepage';
import React, {Suspense, useState} from 'react';
import {Sheet, SheetContent, SheetTrigger} from "@/shadcn/components/ui/sheet";
import {Armchair, FolderHeart, Menu, Newspaper, SquareUserRound} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/shadcn/components/ui/tabs';
import {Button} from "@/shadcn/components/ui/button";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import {SearchFilter} from "@/components/filters/search-filter";

const MobileNavigation = dynamic(() => import('@/components/layouts/mobile-menu/mobile-navigation'), {
    ssr: false,
});

const CategoryMegaMenu = dynamic(() => import('@/components/layouts/menu/category-mega-menu'), {
    ssr: false,
});

const MobileCategoryMenu = dynamic(() => import('@/components/layouts/mobile-menu/mobile-category-menu'), {
    ssr: false,
});


const Header = ({shadowNone = false}) => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const isHomePage = useIsHomePage();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const className = cn('flex flex-col top-0 z-50 w-full lg:h-auto max-w-screen-3xl  mx-auto ', {
        '': isHomePage,
    });


    const isMultilangEnable =
        process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
        !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;


    const closeLocation = () => setOpenDropdown(false);


    return (
        <header
            className={className}
        >
            <div
                className={cn(
                    'fixed inset-0 -z-10 h-[100vh] w-full bg-black/50',
                    openDropdown === true ? '' : 'hidden'
                )}
                onClick={closeLocation}
            ></div>

            <div className={'flex flex-col bg-white text-gray-800'}>
                <div className={'grid grid-cols-3 w-full items-center justify-evenly lg:h-28 lg:px-4 xl:px-8'}>
                    {/* Mobile Navigation Trigger */}
                    <div className="flex items-center xl:col-start-1 xl:col-end-2 xl:hidden p-4">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger>
                                <div className={'flex flex-col items-center'}>
                                    <Menu className="h-5 w-5"/>
                                    <span className={'text-xs'}>Menu</span>
                                </div>
                            </SheetTrigger>
                            <SheetContent side="right" className="p-4">
                                <div className={'w-full flex justify-center'}>
                                    <Logo className={'pt-2 pb-3'}/>
                                </div>
                                <div className={'my-3'}>
                                    <SearchFilter/>
                                </div>


                                <Tabs defaultValue="allcategories" className="">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="allcategories">
                                            <Armchair className="w-4 h-4 mr-2"/>
                                            Alle Möbel
                                        </TabsTrigger>

                                        <TabsTrigger value="navigation">
                                            <Newspaper className={'w-4 h-4 mr-2'}/>
                                            Magazin
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="allcategories">

                                        <Suspense fallback={<div className={'relative flex flex-col w-full gap-2'}>
                                            {[...Array(8).keys()].map(num => (
                                                <Skeleton key={num} className={'min-h-8 min-w-full'}/>
                                            ))}
                                        </div>}>
                                            <MobileCategoryMenu closeDrawer={() => setIsSheetOpen(false)}/>
                                        </Suspense>

                                    </TabsContent>
                                    <TabsContent value="navigation">
                                        <Suspense fallback={<div className={'relative flex flex-col w-full gap-2'}>
                                            {[...Array(8).keys()].map(num => (
                                                <Skeleton key={num} className={'min-h-8 min-w-full'}/>
                                            ))}
                                        </div>}>
                                            <MobileNavigation/>
                                        </Suspense>
                                    </TabsContent>
                                </Tabs>

                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className="flex xl:col-start-1 xl:col-end-2 w-full  flex-col justify-center items-center xl:justify-center xl:items-start  ">
                        <Logo
                            className={cn(
                                'pt-2 pb-3',
                                !isMultilangEnable ? 'lg:mx-0' : 'ltr:ml-0 rtl:mr-0'
                            )}
                        />
                    </div>
                    <div className={'hidden lg:flex lg:flex-col w-full justify-center items-center   col-start-1 col-span-full row-start-2 row-end-2 2xl:row-start-1 2xl:row-end-1 2xl:col-start-2 2xl:col-end-3  '}>
                        <Suspense fallback={
                            <div className={'relative flex flex-col w-full lg:flex-row lg:w-[72rem] gap-4 z-40'}>
                                {[...Array(8).keys()].map(num => (
                                    <Skeleton key={num} className={'min-h-12 min-w-36'}/>
                                ))}
                            </div>
                        }>
                            <CategoryMegaMenu/>
                        </Suspense>
                    </div>
                    <div className={'flex justify-end items-center gap-2 col-start-3 col-end-4 2xl:col-start-3 xl:col-end-4'}>
                        {/*<Navigation/>*/}
                        <Button size={'sm'} variant={'ghost'}>
                            <SquareUserRound className={'h-5 w-5 3xl:mr-2'}/>
                            <span className={'hidden 3xl:flex'}>Anmelden</span>
                        </Button>
                        <Button size={'sm'} variant={'ghost'}>
                            <FolderHeart className={'h-5 w-5 3xl:mr-2'}/>
                            <span className={'hidden 3xl:flex'}>Wunschliste</span>
                        </Button>

                    </div>
                </div>
            </div>


        </header>
    );
};

export default Header;
