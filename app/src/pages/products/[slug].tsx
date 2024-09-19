import {Product} from '@/types';
import Seo from '@/components/seo/seo';
import HomeLayout from '@/components/layouts/_home';
import {Button} from '@/shadcn/components/ui/button';
import {useState} from 'react';
import {fetchProducts} from "@/framework/product";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {Badge} from "@/shadcn/components/ui/badge";
import {Card, CardContent} from "@/shadcn/components/ui/card";
import {ChevronLeft, ChevronRight, Truck} from "lucide-react";

interface ProductPageProps {
    product: Product; // Replace with your proper product type
}

const ProductPage = ({product}: ProductPageProps) => {
    const [currentImage, setCurrentImage] = useState(0)

    // Extracting the first variant for simplicity, you can handle multiple variants if needed
    const variant = product.variants[0]

    const images = variant.images || []

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Product not found</div>
    }

    return (
        <>
            <Seo
                title={variant.productName}
                url={variant.slug}
                images={images}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div className="relative">
                        <div className="aspect-square overflow-hidden rounded-lg">
                            <img
                                src={images[currentImage]}
                                alt={`${variant.productName} - Image ${currentImage + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* Previous Image Button */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>

                        {/* Next Image Button */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-4 w-4"/>
                        </Button>

                        {/* Thumbnails */}
                        <div className="flex mt-4 space-x-2">
                            {images.map((img: string, index: number) => (
                                <button
                                    key={index}
                                    className={`w-16 h-16 rounded-md overflow-hidden ${
                                        index === currentImage ? 'ring-2 ring-primary' : ''
                                    }`}
                                    onClick={() => setCurrentImage(index)}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full"/>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{variant.productName}</h1>
                        <div className="flex items-center mb-4">
                            <Badge variant="secondary">{variant.originalColor}</Badge>
                        </div>
                        <div className="text-2xl font-bold mb-4">€{variant.price.toFixed(2)}</div>
                        <p className="text-muted-foreground mb-6">{variant.description}</p>

                        {/* Key Features */}
                        <Card className="mb-6">
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-2">Key Features:</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>3 Spiegeltüren, einfach verspiegelt (nur außen)</li>
                                    <li>6 Glaseinlegeböden (9 Fächer)</li>
                                    <li>2-fach Schalter+Steckdosen Element innen</li>
                                    <li>Integrierte Aufbauleuchte (12 Volt LED - 5 Watt)</li>
                                    <li>Gesamtmaß B/H/T: 120/71/17cm</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Delivery Info */}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                            <Truck className="h-4 w-4"/>
                            <span>Lieferbar in {variant.deliveryTime}</span>
                        </div>

                        {/* Add to Cart Button */}
                        <Button className="w-full mb-4">Add to Cart</Button>

                        {/* Additional Information */}
                        <p className="text-sm text-muted-foreground">
                            Free delivery. 30-day returns. Satisfaction guaranteed.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}


ProductPage.getLayout = function getLayout(page) {
    return <HomeLayout>{page}</HomeLayout>;
};

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (
    context: GetServerSidePropsContext
) => {
    const {slug} = context.query;

    const filters: any = {};

    // Add the slug filter if provided
    if (slug !== undefined) {
        filters['filters'] = `variants.slug = "${slug}"`; // Ensure proper syntax for the filter
    }

    try {
        // Fetch the product data using the filters
        const {data, meta} = await fetchProducts(filters);


        if (!data || data.length === 0) {
            return {
                notFound: true, // Return 404 if no product is found
            };
        }
        const product = data[0];

        // Return the fetched product as props
        return {
            props: {
                product,
            },
        };
    } catch (error) {
        console.error('Error fetching product:', error);

        // Handle the error and return a 404 or error page
        return {
            notFound: true,
        };
    }
};

export default ProductPage;
