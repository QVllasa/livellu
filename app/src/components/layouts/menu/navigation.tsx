import Link from '@/components/ui/link';
import {Routes} from '@/config/routes';
import {useTranslation} from 'next-i18next';
import useNavigation from "@/lib/hooks/use-navigation";
import React from "react";

import {cn} from "@/shadcn/lib/utils"

import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,} from "@/shadcn/components/ui/navigation-menu"
import {NavigationItem} from "@/types";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]

const headerLinks = [
    {href: Routes.shops, icon: null, label: 'nav-menu-shops'},
    {href: Routes.coupons, icon: null, label: 'nav-menu-offer'},
    {href: Routes.help, label: 'nav-menu-faq'},
    {href: Routes.contactUs, label: 'nav-menu-contact'},
];

const Navigation = () => {
    const {t} = useTranslation('common');

    const {navigationData, loading, error} = useNavigation({populate: 'children'});

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    let home = navigationData.find((item: NavigationItem) => item?.url === '/');
    let navigationItems = navigationData.filter((item) => (item?.children?.data?.length ?? 0) > 0);

    console.log("navigationItems", navigationItems)


    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href={home?.url ?? '/'} passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            {t(home?.title)}
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                {navigationItems.map(({url, title, icon, children}, index) =>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] grid-cols-1 lg:w-[400px]">
                                {children?.data?.map(({attributes}) => (
                                    <ListItem
                                        key={attributes.title}
                                        title={attributes.title}
                                        href={'/articles/'+url + (attributes.url ?? '/')}
                                    >
                                        <span>{attributes.subtitle}</span>
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



