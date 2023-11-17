import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '@/assets/css/main.css';
import 'react-toastify/dist/ReactToastify.css';
import { ModalProvider } from '@/components/ui/modal/modal.context';
import ManagedModal from '@/components/ui/modal/managed-modal';
import ManagedDrawer from '@/components/ui/drawer/managed-drawer';
import DefaultSeo from '@/components/seo/default-seo';
import { SearchProvider } from '@/components/ui/search/search.context';
import { CartProvider } from '@/store/quick-cart/cart.context';

import { NextPageWithLayout } from '@/types';
import QueryProvider from '@/framework/client/query-provider';
import { getDirection } from '@/lib/constants';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const ToastContainer = dynamic(
  () => import('react-toastify').then((module) => module.ToastContainer),
  { ssr: false }
);

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({
  Component,
  pageProps: {
    //@ts-ignore
    session,
    ...pageProps
  },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const { locale } = useRouter();
  const dir = getDirection(locale);

  return (
    <>
      <div dir={dir}>
          <QueryProvider pageProps={pageProps}>
            <SearchProvider>
              <ModalProvider>
                <CartProvider>
                    <DefaultSeo />
                    {getLayout(<Component {...pageProps} />)}
                    <ManagedModal />
                    <ManagedDrawer />
                    <ToastContainer autoClose={2000} theme="colored" />
                </CartProvider>
              </ModalProvider>
            </SearchProvider>
          </QueryProvider>
      </div>
    </>
  );
}

export default appWithTranslation(CustomApp);
