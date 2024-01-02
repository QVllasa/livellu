import {motion} from 'framer-motion';
import {useTranslation} from 'next-i18next';
import {useAtom} from 'jotai';
import Header from './header';
import HeaderMinimal from './header-minimal';
import Footer from './footer';
import {SearchIcon} from '@/components/icons/search-icon';
import {displayMobileHeaderSearchAtom} from '@/store/display-mobile-header-search-atom';

import dynamic from 'next/dynamic';
import Seo from "@/components/seo/seo";
import Categories from "@/components/categories/categories";

const MobileNavigation = dynamic(() => import('./mobile-navigation'), {
    ssr: false,
});

export default function HomeLayout({
                                       children,
                                   }: React.PropsWithChildren<{}>) {
    const {t} = useTranslation('common');
    const [, setDisplayMobileHeaderSearch] = useAtom(
        displayMobileHeaderSearchAtom
    );

    const layout = 'modern';
    return (
        <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
            {['minimal', 'compact'].includes(layout) ? (
                <HeaderMinimal layout={layout}/>
            ) : (
                <Header layout={layout}/>
            )}
            <div className="min-h-screen">
                <>
                    {/*<Seo title={type?.name} url={type?.slug} images={type?.banners}/>*/}
                    <div className="flex flex-1 bg-gray-100">
                        <div className="sticky top-22 hidden h-full bg-gray-100 lg:w-auto xl:block">
                            <Categories layout="modern" variables={[]}/>
                        </div>
                        <main className="block w-full pt-14 lg:mt-6 lg:pt-20 xl:overflow-hidden xl:px-5">
                            {children}
                        </main>
                    </div>
                </>
            </div>
            {['compact'].includes(layout) && <Footer/>}
            <MobileNavigation>
                <motion.button
                    whileTap={{scale: 0.88}}
                    onClick={() => setDisplayMobileHeaderSearch((prev) => !prev)}
                    className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-0"
                >
                    <span className="sr-only">{t('text-search')}</span>
                    <SearchIcon width="17.05" height="18"/>
                </motion.button>
            </MobileNavigation>
        </div>
    );
}
