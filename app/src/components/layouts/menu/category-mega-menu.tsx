import React, {useEffect, useState} from "react";
import {Category} from "@/types";
import {capitalize} from "lodash";
import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,} from "@/shadcn/components/ui/navigation-menu"
import Link from "next/link";
import {useAtom} from "jotai/index";
import {allCategoriesAtom} from "@/store/filters";
import Icon from "@/components/ui/icon";
import {cn} from "@/shadcn/lib/utils";


export function CategoryMegaMenu() {
    const [allCategories] = useAtom(allCategoriesAtom);
    const [categories, setCategories] = useState<Category[]>([]);


    useEffect(() => {
        setCategories(allCategories);
    }, [allCategories]);

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
                        <NavigationMenuContent className="w-full">
                            <ul className="grid gap-3 p-4 md:w-[800px] lg:w-[100rem] lg:grid-cols-3 z-30 items-stretch">
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
            </NavigationMenuList>
        </NavigationMenu>
    )
}




