import useNavigation from "@/lib/hooks/use-navigation";
import React from "react";
import {NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle,} from "@/shadcn/components/ui/navigation-menu";
import {Navigation as NavigationType} from "@/types";
import Link from "next/link";

export const Navigation = () => {
    const filter = {
        populate: {
            category: {
                populate: {
                    article_categories: {
                        populate: '*'
                    },
                    child_categories: {
                        populate: '*'
                    },
                }
            }
        }
    }

    const {navigationData, loading, error} = useNavigation(filter);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    let home = navigationData.find((item: NavigationType) => item?.url === '/');

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
                {navigationData.map(({url, title, icon, category}, index) =>
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


