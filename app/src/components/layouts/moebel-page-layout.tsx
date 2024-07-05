import Header from './header';
import Footer from './footer';


export default function MoebelPageLayout({children}: React.PropsWithChildren<{}>) {

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
            <Header/>
            {children}
            <Footer/>
        </div>
    );
}
export const getLayout = (page: React.ReactElement) => (
    <MoebelPageLayout>{page}</MoebelPageLayout>
);
