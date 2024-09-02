import React from "react";
import {NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle,} from "@/shadcn/components/ui/navigation-menu";
import {NavigationItem} from "@/types";
import Link from "next/link";
import {useAtom} from "jotai/index";
import {allNavigation} from "@/store/navigation";

export const Navigation = () => {
    const [navigationData] = useAtom(allNavigation);

    let home = navigationData.find((item: NavigationItem) => item?.url === '/');

    return (
        <NavigationMenu className="flex w-auto lg:flex lg:space-x-4 lg:items-center">
            <NavigationMenuList className="flex flex-col w-full lg:flex-row lg:w-auto">
                <NavigationMenuItem>
                    <NavigationMenuLink  className={navigationMenuTriggerStyle()}>
                        <Link href={home?.url ?? '/'} >
                        Home
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                {navigationData.map(({url, title, icon}, index) =>
                    url !== '/' &&
                    <NavigationMenuItem key={index + (title ?? '')}>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <Link href={url} >
                                {title}
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
};


