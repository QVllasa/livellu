import Header from './header';
import Footer from './footer';
import {useRouter} from 'next/router';


export default function SiteLayout({ children }: React.PropsWithChildren<{}>) {

  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
        <Header  />
      {children}
      {<Footer />}
      {/*<MobileNavigation />*/}
    </div>
  );
}
export const getLayout = (page: React.ReactElement) => (
  <SiteLayout>{page}</SiteLayout>
);
