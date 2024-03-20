import Link from '@/components/ui/link';
import useNavigation from "@/lib/hooks/use-navigation";
import React, {useState} from "react";

import {cn} from "@/shadcn/lib/utils"

import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,} from "@/shadcn/components/ui/navigation-menu"
import {ArticleCategory, Entity, Navigation} from "@/types";
import {Button} from "@/shadcn/components/ui/button";
import {ChevronRight} from "@/components/icons/chevron-right";
import {ChevronDown} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/shadcn/components/ui/collapsible";


const Navigation = () => {


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

    let home = navigationData.find((item: Navigation) => item?.url === '/');


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
                {navigationData.map(({url, title, icon, category}, index) =>
                    url !== '/' &&
                    <NavigationMenuItem key={index + (title ?? '')}>
                        <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] grid-cols-1 lg:w-[400px]">
                                {category?.data?.attributes.child_categories?.data?.map(({attributes}) => (
                                    <ListItem
                                        key={attributes.name}
                                        title={attributes.name}
                                        href={'/category/' + (attributes.identifier ?? '/')}
                                        category={attributes}
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


interface ListItemProps {
    title: string;
    children: React.ReactNode;
    category: any; // Replace 'any' with the actual type of 'category'
    [key: string]: any; // for the rest of the properties
}

const ListItem: React.FC<ListItemProps> = ({title, children, category, ...props}) => {
    const [isOpen, setIsOpen] = useState(false)

    console.log('category: ', category)

    return (
        <li>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className={'flex gap-0 justify-between w-full'}>
                    <NavigationMenuLink asChild>
                        <a
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
                    </NavigationMenuLink>
                    <CollapsibleTrigger>
                        <Button variant="ghost" className={'flex gap-4 h-full'}>
                            {!isOpen ? <ChevronRight className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="rounded-xl flex cursor-pointer items-center px-5 text-sm capitalize text-heading transition duration-200 ">
                    <ul className="grid w-[200px] gap-3 md:w-[300px] grid-cols-1 lg:w-[400px] py-4">
                        {category?.article_categories?.data?.map(({attributes}: Entity<ArticleCategory>) => {
                            console.log("articleCategory: ", attributes)
                            return <li className={'hover:text-accent'} key={attributes.title}>
                                <a href={'/article-category/' + (attributes.slug ?? '/')}> <span>{attributes.title}</span></a>
                            </li>
                        })}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </li>
    )
}

ListItem.displayName = 'ListItem';


