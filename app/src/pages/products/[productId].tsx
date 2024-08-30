import type {NextPageWithLayout} from '@/types';
import {Product} from '@/types';
import {GetServerSideProps, GetServerSidePropsContext} from 'next';
import {fetchProducts} from "@/framework/product";
import Seo from "@/components/seo/seo";

interface ProductPageProps {
    product: Product | null;
}

const ProductPage: NextPageWithLayout<ProductPageProps> = ({ product }) => {

    // TODO set id for filtering product in meilisearch
    console.log("product", product)

    // If product is not found, display a message or handle appropriately
    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <>
            <Seo
                title={product.name}
                url={product.slug}
                images={product.image ? [product.image] : []}
            />
            <div className="min-h-screen bg-light">
                <>
                    {/* Render product details here */}
                    {/* Example: <Details product={product} /> */}
                </>
                {product.related_products?.length > 1 && (
                    <div className="p-5 lg:p-14 xl:p-16">
                        {/* Render related products here */}
                    </div>
                )}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (
    context: GetServerSidePropsContext
) => {
    const { productId } = context.query;


    const filters = {}

    if (productId !== undefined) {
        // @ts-ignore
        filters['filter'] = `id = ${productId}`
    }

    try {
        // Fetch the product data by ID
        const product = await fetchProducts(filters); // Replace with actual fetching logic

        if (!product) {
            return {
                notFound: true,
            };
        }

        // Return the product data as props
        return {
            props: {
                product,
            },
        };
    } catch (error) {
        console.error('Error fetching product:', error);

        // Handle error, potentially returning a 404 or custom error page
        return {
            notFound: true,
        };
    }
};

export default ProductPage;
