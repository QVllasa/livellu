import React, {useEffect, useState} from "react";
import {NavigationItem} from "@/types";
import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger,} from "@/shadcn/components/ui/navigation-menu";
import Link from "next/link";
import {useAtom} from "jotai/index";
import {allNavigation} from "@/store/navigation";
import Icon from "@/components/ui/icon";
import {Button} from "@/shadcn/components/ui/button";

export const Navigation = () => {
    const [navigationData] = useAtom(allNavigation);
    const [navItems, setNavItems] = useState<NavigationItem[]>([]);

    useEffect(() => {
        setNavItems(navigationData);
    }, [navigationData]);

    return (
        <NavigationMenu>
            <NavigationMenuList className="flex flex-col w-full lg:flex-row lg:w-auto relative z-40">
                <NavigationMenuItem className={'right-0'}>
                    <NavigationMenuTrigger>
                        <div className={'flex items-center justify-center'}>
                            <Icon name={'NewsPaper'} className="w-4 h-4 mr-2"/>
                            Magazin
                        </div>
                    </NavigationMenuTrigger>

                    <NavigationMenuContent className="w-full lg:w-[32rem] mx-auto ">
                        {navItems.map(({ url, title, icon }, index) =>
                                url !== '/' && (
                                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-full lg:grid-cols-[.75fr_1fr] z-30 items-start">
                                    <Link href={url} className={'flex items-center justify-center'}>
                                        <Button variant="outline" size="sm" className={'w-full'}>
                                            {icon && <Icon name={icon} className="w-4 h-4 mr-2"/>}
                                            {title}
                                        </Button>
                                    </Link>
                                </ul>
                )
                )}
            </NavigationMenuContent>
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    );
};
