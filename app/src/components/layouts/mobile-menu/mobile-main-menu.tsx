import {useRouter} from 'next/router';
import {Routes} from '@/config/routes';
import {useTranslation} from 'next-i18next';
import DrawerWrapper from '@/components/ui/drawer/drawer-wrapper';
import {useAtom} from 'jotai';
import {drawerAtom} from '@/store/drawer-atom';
import useNavigation from "@/lib/hooks/use-navigation";
import {Navigation} from "@/types";
import React, {useState} from "react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/shadcn/components/ui/collapsible";
import {CaretDown} from "@/components/icons/caret-down";
import {Button} from "@/shadcn/components/ui/button";
import {ChevronDown, SortAscIcon, SortDescIcon} from "lucide-react";
import {ChevronRight} from "@/components/icons/chevron-right";

const headerLinks = [
    {href: Routes.shops, label: 'nav-menu-shops'},
    {href: Routes.manufacturers, label: 'text-manufacturers'},
    {href: Routes.coupons, label: 'nav-menu-offer'},
    {href: Routes.contactUs, label: 'nav-menu-contact'},
];

export default function MobileMainMenu() {
    const {t} = useTranslation('common');
    const router = useRouter();
    const [_, closeSidebar] = useAtom(drawerAtom);
    const [isOpen, setIsOpen] = useState(false)


    const {navigationData, loading, error} = useNavigation({populate: 'article_categories'});

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    let home = navigationData.find((item: Navigation) => item?.url === '/');
    let navigationItems = navigationData.filter((item) => (item?.article_categories?.data?.length ?? 0) > 0);

    function handleClick(path: string) {
        router.push(path);
        closeSidebar({display: false, view: ''});
    }

    return (
        <DrawerWrapper>
                <nav className="flex flex-1 flex-col px-4 mt-4" aria-label="Sidebar">
                    <ul role="list" className="-mx-2 space-y-1">
                        {navigationItems.map((navigation, index) => (
                            <NavigationItem navigation={navigation} index={index} key={index}/>
                        ))}

                    </ul>
                </nav>
        </DrawerWrapper>
    );
}


const NavigationItem = ({navigation, index}: {navigation: Navigation, index: number}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <Collapsible    open={isOpen}
                            onOpenChange={setIsOpen}  >
                <CollapsibleTrigger>
                        <Button variant="ghost" className={'flex gap-4'}>
                            {navigation.title}

                            {!isOpen ? <ChevronRight className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                            <span className="sr-only">Toggle</span>
                        </Button>

                </CollapsibleTrigger>
                <CollapsibleContent className="rounded-xl flex cursor-pointer items-center px-5 text-sm capitalize text-heading transition duration-200  md:px-8"
                >
                    <ul className="grid w-[200px] gap-3 md:w-[300px] grid-cols-1 lg:w-[400px] py-4">
                        {navigation.article_categories?.data?.map(({attributes}) => (
                            <li className={'hover:text-accent'}
                                key={attributes.title}
                            >
                                <a href={'/article-category/' + (attributes.slug ?? '/')}> <span>{attributes.title}</span></a>
                            </li>
                        ))}
                    </ul>

                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}
