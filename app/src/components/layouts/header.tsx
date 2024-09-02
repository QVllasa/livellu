import Logo from '@/components/ui/logo';
import cn from 'classnames';
import {useAtom} from 'jotai';
import {displayMobileHeaderSearchAtom} from '@/store/display-mobile-header-search-atom';
import dynamic from 'next/dynamic';
import {authorizationAtom} from '@/store/authorization-atom';
import {useIsHomePage} from '@/lib/use-is-homepage';
import React, {Suspense, useState} from 'react';
import {useHeaderSearch} from '@/layouts/headers/header-search-atom';
import {Navigation} from "@/components/layouts/menu/navigation";
import {Sheet, SheetContent, SheetTrigger} from "@/shadcn/components/ui/sheet";
import {Menu} from "lucide-react";
import {SearchFilter} from "@/components/filters/search-filter"; // Assuming you are using lucide-react icons
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/shadcn/components/ui/tabs';
import MobileCategoryMenu from "@/components/filters/mobile/mobile-category-menu";
import MobileNavigation from "@/components/layouts/mobile-menu/mobile-navigation";

const Search = dynamic(() => import('@/components/ui/search/search'));

const Header = ({initialCategory}) => {
    const {show, hideHeaderSearch} = useHeaderSearch();
    const [displayMobileHeaderSearch] = useAtom(displayMobileHeaderSearchAtom);
    const [isAuthorize] = useAtom(authorizationAtom);
    const [openDropdown, setOpenDropdown] = useState(false);
    const isHomePage = useIsHomePage();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const isMultilangEnable =
        process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
        !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;


    const closeLocation = () => setOpenDropdown(false);


    return (
        <header
            className={cn('flex flex-col top-0 z-50 w-full lg:h-36', {
                '': isHomePage,
                ' border-b border-border-200 shadow-sm': !isHomePage,
            })}
        >
            <div
                className={cn(
                    'fixed inset-0 -z-10 h-[100vh] w-full bg-black/50',
                    openDropdown === true ? '' : 'hidden'
                )}
                onClick={closeLocation}
            ></div>

            <div className={'flex flex-col bg-white'}>
                <div className={'flex w-full items-center justify-between lg:h-22 lg:px-4 xl:px-8'}>
                    <div className="flex w-full  flex-col justify-center items-center lg:w-auto ">
                        <Logo
                            className={cn(
                                'pt-2 pb-3',
                                !isMultilangEnable ? 'lg:mx-0' : 'ltr:ml-0 rtl:mr-0'
                            )}
                        />
                        {/* Mobile Navigation Trigger */}
                        <div className="flex items-center lg:hidden absolute left-4 top-4">
                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <SheetTrigger>
                                    <Menu className="h-6 w-6"/>
                                </SheetTrigger>
                                <SheetContent side="right" className="p-4">
                                    <div className={'w-full flex justify-center'}>
                                        <Logo className={'pt-2 pb-3'}/>
                                    </div>

                                    <Tabs defaultValue="allcategories" className="">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="allcategories">Alle Möbel</TabsTrigger>
                                            <TabsTrigger value="navigation">Magazin</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="allcategories">
                                            <Suspense fallback={<div>Loading...</div>}>
                                                <MobileCategoryMenu closeDrawer={() => setIsSheetOpen(false)}/>
                                            </Suspense>

                                        </TabsContent>
                                        <TabsContent value="navigation">
                                            <Suspense fallback={<div>Loading...</div>}>
                                                <MobileNavigation/>
                                            </Suspense>
                                        </TabsContent>
                                    </Tabs>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                    <div className={'hidden xl:flex w-[48rem]'}>
                        <SearchFilter/>
                    </div>
                    <ul className="hidden lg:flex">
                        <Suspense fallback={<div>Loading...</div>}>
                            <Navigation/>
                        </Suspense>

                    </ul>
                </div>
                <div className={'hidden lg:flex w-full justify-center items-center'}>
                    {/*<Suspense fallback={<div>Loading...</div>}>*/}
                    {/*    <CategoryMegaMenu/>*/}
                    {/*</Suspense>*/}
                </div>

            </div>


        </header>
    );
};

export default Header;
