import React, {useEffect, useState} from "react";
import {Category, NavigationItem} from "@/types";
import {capitalize} from "lodash";
import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,} from "@/shadcn/components/ui/navigation-menu"
import Link from "next/link";
import {useAtom} from "jotai/index";
import {allCategoriesAtom} from "@/store/filters";
import Icon from "@/components/ui/icon";
import {cn} from "@/shadcn/lib/utils";
import {allNavigation} from "@/store/navigation";


export function CategoryMegaMenu() {
    const [allCategories] = useAtom(allCategoriesAtom);
    const [categories, setCategories] = useState<Category[]>([]);
    const [navigationData] = useAtom(allNavigation);
    const [navItems, setNavItems] = useState<NavigationItem[]>([]);

    useEffect(() => {
        setCategories(allCategories);
    }, [allCategories]);

    useEffect(() => {
        setNavItems(navigationData);
    }, [navigationData]);

    return (
        <NavigationMenu>
            <NavigationMenuList className="relative flex flex-col w-full lg:flex-row lg:w-[72rem]  z-40">
                {categories.map((category, index) =>
                    <NavigationMenuItem className={'w-full'} key={index + (category?.name ?? '')}>
                        <NavigationMenuTrigger>
                            <Link href={`/${category?.slug}`} className={'flex items-center justify-center'}>
                                <Icon name={category?.lucide_icon} className="w-4 h-4 mr-2"/>
                                {capitalize(category?.name)}
                            </Link>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="w-full  ">
                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[75rem] lg:grid-cols-[.75fr_1fr] z-30 items-stretch">
                                {category?.child_categories?.map((childCategory) => (
                                    <li key={childCategory?.name} className={'w-full'}>
                                        <Link legacyBehavior passHref href={`/${category?.slug}/${childCategory?.slug ?? '/'}`}
                                              className={"min-w-full flex select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-foreground focus:bg-gray focus:text-gray-foreground"}>
                                            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full justify-start")}>{capitalize(childCategory?.name)}</NavigationMenuLink>
                                        </Link>
                                    </li>
                                ))}

                            </ul>
                        </NavigationMenuContent>

                    </NavigationMenuItem>
                )}
                {/*{navItems.map(({url, title, icon}, index) =>*/}
                {/*        url !== '/' && (*/}
                {/*            <NavigationMenuItem key={index + (title ?? '')}>*/}
                {/*                <NavigationMenuTrigger>*/}
                {/*                    <Link href={url} className={'flex items-center justify-center'}>*/}
                {/*                        {icon && <Icon name={icon} className="w-4 h-4 mr-2"/>}*/}
                {/*                        {title}*/}
                {/*                    </Link>*/}
                {/*                </NavigationMenuTrigger>*/}
                {/*                <NavigationMenuContent className="w-full lg:w-[104rem] mx-auto">*/}
                {/*                    some content coming soon..*/}
                {/*                </NavigationMenuContent>*/}
                {/*            </NavigationMenuItem>*/}
                {/*        )*/}
                {/*)}*/}
            </NavigationMenuList>
        </NavigationMenu>
    )
}




