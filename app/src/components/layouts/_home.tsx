import Header from './header';
import Footer from './footer';


export default function HomeLayout({children}: React.PropsWithChildren<{}>) {

    return (
        <div className="flex min-h-screen flex-col  transition-colors duration-150 bg-white">
            <Header />

            {/*<div className="min-h-screen">*/}
            {/*    <>*/}
            {/*        /!*<Seo title={type?.name} url={type?.slug} images={type?.banners}/>*!/*/}
            {/*        <div className="flex flex-1 bg-gray-100">*/}
            {/*            <div className="sticky top-22 hidden h-full bg-gray-100 lg:w-auto xl:block">*/}
            {/*                /!*<Categories layout="modern" variables={[]}/>*!/*/}
            {/*            </div>*/}
            {/*            <main className="block w-full pt-14 lg:pt-12 xl:px-5 relative bg-white">*/}
                            {children}
            {/*            </main>*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*</div>*/}
             <Footer/>
        </div>
    );
}
