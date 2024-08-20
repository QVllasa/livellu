import React, {useEffect, useState} from "react";
import {NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle,} from "@/shadcn/components/ui/navigation-menu";
import {Category} from "@/types";
import {fetchCategories} from "@/framework/category.ssr";
import {capitalize} from "lodash";

export const CategoryMenu = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        const getCategories = async () => {
            const data = await fetchCategories({level: 0});
            setCategories(data);
        };
        getCategories();
    }, []);

    return (
        <NavigationMenu className="w-full lg:flex lg:space-x-4 lg:items-center">
            <NavigationMenuList className="flex flex-col w-full lg:flex-row lg:w-auto">
                {categories.map(({name, slug}, index) =>
                    <NavigationMenuItem key={index + (name ?? '')}>
                            <NavigationMenuLink href={`/${slug}`} className={navigationMenuTriggerStyle()}>
                                {capitalize(name)}
                            </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

