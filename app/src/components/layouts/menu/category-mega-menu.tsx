import React, {useEffect, useState} from "react";
import {Category} from "@/types";
import {capitalize} from "lodash";
import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger,} from "@/shadcn/components/ui/navigation-menu"
import Link from "next/link";
import {useAtom} from "jotai/index";
import {allCategoriesAtom} from "@/store/filters";
import Icon from "@/components/ui/icon";


export function CategoryMegaMenu() {
    const [allCategories] = useAtom(allCategoriesAtom);
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {

            setCategories(allCategories);
            console.log("allCategories", allCategories)

    }, [allCategories]);

    return (
        <NavigationMenu>
            <NavigationMenuList className="flex flex-col w-full lg:flex-row lg:w-[980px] relative z-40">
                {categories.map((category, index) =>
                    <NavigationMenuItem key={index + (category?.name ?? '')}>
                        <NavigationMenuTrigger>
                            <Link href={`/${category?.slug}`} className={'flex items-center justify-center'}>
                                <Icon name={category?.lucide_icon} className="w-4 h-4 mr-2" />
                                {capitalize(category?.name)}
                            </Link>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="w-full lg:w-auto" >
                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[980px] lg:grid-cols-[.75fr_1fr] z-30">
                                {category?.child_categories?.map((childCategory) => (
                                    <li key={childCategory?.name}>
                                    <Link href={`/${category?.slug}/${childCategory?.slug ?? '/'}` } className={"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-foreground focus:bg-gray focus:text-gray-foreground"}>
                                <div className="text-sm font-medium leading-none">{capitalize(childCategory?.name)}</div>

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




