import type {NextPageWithLayout} from '@/types';
import type {InferGetStaticPropsType} from 'next';
import {getLayout} from '@/components/layouts/layout';
import {getStaticProps} from '@/framework/product.ssr';

// export {getStaticPaths, getStaticProps};



const ProductPage: NextPageWithLayout<
    InferGetStaticPropsType<typeof getStaticProps>
> = () => {

    return (<> </>);
        // <>
        //     <Seo
        //         title={product.name}
        //         url={product.slug}
        //         images={!isEmpty(product?.image) ? [product.image] : []}
        //     />
        //     <AttributesProvider>
        //         <div className="min-h-screen bg-light">
        //             <>
        //                 {/*<Details product={product}/>*/}
        //             </>
        //             {product?.related_products?.length > 1 && (
        //                     <div className="p-5 lg:p-14 xl:p-16">
        //
        //                     </div>
        //                 )}
        //         </div>
        //     </AttributesProvider>
        // </>
    // );
};
ProductPage.getLayout = getLayout;
export default ProductPage;
