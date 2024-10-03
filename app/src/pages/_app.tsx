import type {AppProps} from 'next/app';
import {appWithTranslation} from 'next-i18next';
import '@/assets/css/main.css';
import 'react-toastify/dist/ReactToastify.css';
import {ModalProvider} from '@/components/ui/modal/modal.context';
import DefaultSeo from '@/components/seo/default-seo';
import {SearchProvider} from '@/components/ui/search/search.context';
import {CartProvider} from '@/store/quick-cart/cart.context';

import {NextPageWithLayout} from '@/types';
import QueryProvider from '@/framework/client/query-provider';
import {getDirection} from '@/lib/constants';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {TooltipProvider} from "@/shadcn/components/ui/tooltip";
import ProductSheet from "@/components/products/product-sheet";
import {ProductSheetProvider} from "@/lib/context/product-sheet-context";
import {Suspense} from "react";
import ErrorBoundary from "@/components/error-boundary";

const ToastContainer = dynamic(
    () => import('react-toastify').then((module) => module.ToastContainer),
    {ssr: false}
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
    const {locale} = useRouter();
    const dir = getDirection(locale);

    return (
        <>
            <div dir={dir}>
                <ProductSheetProvider>

                    <TooltipProvider>
                        <QueryProvider pageProps={pageProps}>
                            <SearchProvider>
                                <ModalProvider>
                                    <CartProvider>
                                        <DefaultSeo/>
                                        {getLayout(<Component {...pageProps} />)}
                                        <ToastContainer autoClose={2000} theme="colored"/>
                                    </CartProvider>
                                </ModalProvider>
                            </SearchProvider>
                        </QueryProvider>
                    </TooltipProvider>

                    <Suspense fallback={<div>Loading...</div>}>
                        <ErrorBoundary>
                            <ProductSheet/>
                        </ErrorBoundary>
                    </Suspense>


                </ProductSheetProvider>
            </div>
        </>
    );
}

export default appWithTranslation(CustomApp);
