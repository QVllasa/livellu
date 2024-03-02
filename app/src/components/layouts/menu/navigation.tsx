import Link from '@/components/ui/link';
import useNavigation from "@/lib/hooks/use-navigation";
import React from "react";

import {cn} from "@/shadcn/lib/utils"

import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,} from "@/shadcn/components/ui/navigation-menu"
import {Navigation} from "@/types";


const Navigation = () => {

    const {navigationData, loading, error} = useNavigation({populate: 'articles'});

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    let home = navigationData.find((item: Navigation) => item?.url === '/');
    let navigationItems = navigationData.filter((item) => (item?.articles?.data?.length ?? 0) > 0);

    console.log("navigationItems", navigationItems)


    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href={home?.url ?? '/'} passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            {home?.title}
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                {navigationItems.map(({url, title, icon, articles}, index) =>
                    <NavigationMenuItem key={index + title}>
                        <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] grid-cols-1 lg:w-[400px]">
                                {articles?.data?.map(({attributes}) => (
                                    <ListItem
                                        key={attributes.title}
                                        title={attributes.title}
                                        href={'/articles/' + (attributes.slug ?? '/')}
                                    >
                                        <span>{attributes.summary}</span>
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                )
                }
            </NavigationMenuList>
        </NavigationMenu>
    )

};

export default Navigation;


const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({className, title, children, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})

ListItem.displayName = 'ListItem';


