import Link from '@/components/ui/link';
import useNavigation from "@/lib/hooks/use-navigation";
import React from "react";

import {cn} from "@/shadcn/lib/utils"

import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,} from "@/shadcn/components/ui/navigation-menu"
import {Navigation} from "@/types";


const Navigation = () => {


    const filter = {

        populate: {
            category: {
                populate: '*'
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

    let home = navigationData.find((item: Navigation) => item?.url === '/');

    const navigationItems = navigationData?.filter((item: Navigation) => item.category?.data?.attributes?.child_categories?.data ).filter(Boolean)

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
                {navigationItems.map(({url, title, icon, category}, index) =>
                    <NavigationMenuItem key={index + (title ?? '')}>
                        <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] grid-cols-1 lg:w-[400px]">
                                {category?.data?.attributes.child_categories?.data?.map(({attributes}) => (
                                    <ListItem
                                        key={attributes.name}
                                        title={attributes.name}
                                        href={'/category/' + (attributes.identifier ?? '/')}
                                    >
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


