import {motion} from 'framer-motion';
import {useAtom} from 'jotai';
import Header from './header';
import Footer from './footer';
import {SearchIcon} from '@/components/icons/search-icon';
import {displayMobileHeaderSearchAtom} from '@/store/display-mobile-header-search-atom';

import dynamic from 'next/dynamic';

const MobileNavigation = dynamic(() => import('./mobile-navigation'), {
    ssr: false,
});

export default function HomeLayout({
                                       children,
                                   }: React.PropsWithChildren<{}>) {

    const [, setDisplayMobileHeaderSearch] = useAtom(
        displayMobileHeaderSearchAtom
    );


    return (
        <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">

            <Header />

            <div className="min-h-screen">
                <>
                    {/*<Seo title={type?.name} url={type?.slug} images={type?.banners}/>*/}
                    <div className="flex flex-1 bg-gray-100">
                        <div className="sticky top-22 hidden h-full bg-gray-100 lg:w-auto xl:block">
                            {/*<Categories layout="modern" variables={[]}/>*/}
                        </div>
                        <main className="block w-full pt-14 lg:pt-12 xl:px-5 relative bg-white">
                            {children}
                        </main>
                    </div>
                </>
            </div>
             <Footer/>
            <MobileNavigation>
                <motion.button
                    whileTap={{scale: 0.88}}
                    onClick={() => setDisplayMobileHeaderSearch((prev) => !prev)}
                    className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-0"
                >
                    <span className="sr-only">{'suchen'}</span>
                    <SearchIcon width="17.05" height="18"/>
                </motion.button>
            </MobileNavigation>
        </div>
    );
}
