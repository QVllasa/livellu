import {GetServerSideProps, GetServerSidePropsContext} from 'next';
import {fetchProducts} from "@/framework/product";

interface ProductPageProps {
    slug: string;
}

const ProductRedirectPage = () => {
    // Since this is just a redirection, you can display a simple loading message
    return <div>Redirecting...</div>;
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const { slug } = context.query;

    if (!slug) {
        return {
            notFound: true, // Return 404 if slug is missing
        };
    }

    try {
        // Fetch the product data based on the slug
        const filters: any = {
            filter: `variants.slug = "${slug}"`, // Fetch products with this slug
        };

        const { data } = await fetchProducts(filters);

        if (!data || data.length === 0 || !data[0].variants || data[0].variants.length === 0) {
            return {
                notFound: true, // If no product or variants found, return 404
            };
        }

        const product = data[0];
        const firstVariant = product.variants[0];

        // Redirect to the first variant's URL
        return {
            redirect: {
                destination: `/products/${slug}/${firstVariant.variantId}`,
                permanent: false,
            },
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        return {
            notFound: true,
        };
    }
};

export default ProductRedirectPage;
