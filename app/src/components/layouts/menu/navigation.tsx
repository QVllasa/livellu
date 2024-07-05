import useNavigation from "@/lib/hooks/use-navigation";
import React, {useState} from "react";
import {cn} from "@/shadcn/lib/utils";
import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,} from "@/shadcn/components/ui/navigation-menu";
import {ArticleCategory, Entity, Navigation as NavigationType} from "@/types";
import {Button} from "@/shadcn/components/ui/button";
import {ChevronRight} from "@/components/icons/chevron-right";
import {ChevronDown} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/shadcn/components/ui/collapsible";

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
        <NavigationMenu className="w-full">
            <NavigationMenuList className="flex flex-col w-full">
                <NavigationMenuItem>
                    <NavigationMenuLink href={home?.url ?? '/'} className={navigationMenuTriggerStyle()}>
                        Home
                    </NavigationMenuLink>
                </NavigationMenuItem>
                {navigationData.map(({url, title, icon, category}, index) =>
                    url !== '/' &&
                    <NavigationMenuItem key={index + (title ?? '')}>
                        {category?.data?.attributes.child_categories?.length ? (
                            <>
                                <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-full gap-3 p-4">
                                        {category?.data?.attributes.child_categories?.map((item) => (
                                            <ListItem
                                                key={item.name}
                                                title={item.name}
                                                href={'/category/' + (item.identifier ?? '/')}
                                                category={item}
                                            >
                                                <span>{item.summary}</span>
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </>
                        ) : (
                            <NavigationMenuLink href={url} className={navigationMenuTriggerStyle()}>
                                {title}
                            </NavigationMenuLink>
                        )}
                    </NavigationMenuItem>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

interface ListItemProps {
    title: string;
    children: React.ReactNode;
    category: any; // Replace 'any' with the actual type of 'category'
    href: string;

    [key: string]: any; // for the rest of the properties
}

const ListItem: React.FC<ListItemProps> = ({title, children, category, href, ...props}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <li>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className={'flex gap-0 justify-between w-full'}>
                    {href ? (
                        <a
                            href={href}
                            className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
                            )}
                            {...props}
                        >
                            <div className="text-sm font-medium leading-none">{title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                {children}
                            </p>
                        </a>
                    ) : (
                        <NavigationMenuLink
                            className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
                            )}
                            {...props}
                        >
                            <div className="text-sm font-medium leading-none">{title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                {children}
                            </p>
                        </NavigationMenuLink>
                    )}
                    <CollapsibleTrigger>
                        <Button variant="ghost" className={'flex gap-4 h-full'}>
                            {!isOpen ? <ChevronRight className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="rounded-xl flex cursor-pointer items-center px-5 text-sm capitalize text-heading transition duration-200">
                    <ul className="grid w-full gap-3 py-4">
                        {category?.article_categories?.data?.map(({ attributes }: Entity<ArticleCategory>) => (
                            <li className={'hover:text-accent'} key={attributes.title}>
                                <a href={'/article-category/' + (attributes.slug ?? '/')}>
                                    <span>{attributes.title}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </li>
    );
}

ListItem.displayName = 'ListItem';
