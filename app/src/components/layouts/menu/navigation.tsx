import React from "react";
import {NavigationMenu, NavigationMenuItem, NavigationMenuList,} from "@/shadcn/components/ui/navigation-menu";
import {NavigationItem} from "@/types";
import Link from "next/link";
import {useAtom} from "jotai/index";
import {allNavigation} from "@/store/navigation";
import {Button} from "@/shadcn/components/ui/button";

export const Navigation = () => {
    const [navigationData] = useAtom(allNavigation);

    let home = navigationData.find((item: NavigationItem) => item?.url === '/');

    return (
        <NavigationMenu className="flex w-auto lg:flex lg:space-x-4 lg:items-center">
            <NavigationMenuList className="flex flex-col w-full lg:flex-row lg:w-auto gap-2">
                <NavigationMenuItem>
                    <Link href={home?.url ?? '/'}>
                        <Button variant={'outline'} size={'sm'}>
                            Home
                        </Button>

                    </Link>
                </NavigationMenuItem>
                {navigationData.map(({url, title, icon}, index) =>
                    url !== '/' &&
                    <NavigationMenuItem key={index + (title ?? '')}>
                        <Link href={url}>
                            <Button variant={'outline'} size={'sm'}>
                                {title}
                            </Button>
                        </Link>
                    </NavigationMenuItem>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
};


