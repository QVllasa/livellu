import {Button} from "@/shadcn/components/ui/button";
import {Card, CardContent} from "@/shadcn/components/ui/card";
import {Product, Variant} from "@/types";
import Link from "next/link";
import {LandingRating} from "../../../../components/landing/rating/LandingRating";
import Image from "next/image";
import {useRouter} from "next/router";
import {useState} from "react";

const ProductCard = (props: { product: Product }) => {
    const { product } = props;
    const router = useRouter();
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    // Extract the color filter from the URL
    const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
    const colorSegment = pathSegments.find(segment => segment.startsWith('farbe:'));

    // Get the selected colors from the URL
    const selectedColors = colorSegment ? colorSegment.replace('farbe:', '').split('.') : [];

    // Find the variant that matches the selected color(s)
    const matchingVariant = product?.variants.find(
        (variant) => selectedColors.some(color => variant?.colors?.includes(color.toUpperCase()))
    );

    // Default to the first variant if no matching variant is found
    const variant: Variant = matchingVariant || product.variants[0];

    // Handle image error by setting a fallback image
    const handleImageError = () => {
        setImageSrc('/img/fallbackimage.webp'); // Using the fallback image from the public folder
    };

    if (!variant) {
        return null;
    }

    return (
        <Card className="transition-transform transform hover:scale-105 max-w-full overflow-hidden">
            <CardContent className="flex items-center justify-center p-0">
                <div className="w-full h-full mx-auto bg-white rounded-lg overflow-hidden duration-300">
                    <Image
                        src={imageSrc || variant?.altImageUrl}
                        alt={variant?.productName}
                        width={300}
                        height={400}
                        className="w-full h-36 sm:h-48 object-contain p-3"
                        onError={handleImageError} // Set the fallback image if there's an error
                    />
                    <div className="p-2 sm:p-4">
                        <h4 className="scroll-m-20 text-sm sm:text-base font-semibold tracking-tight truncate">
                            {variant.productName}
                        </h4>
                        <div className="flex items-center mt-1 sm:mt-2 text-yellow-400">
                            <LandingRating className={'fill-yellow-400'} rating={parseFloat(variant.averageRating ?? 0)} />
                            <span className="ml-2 text-gray-400 font-semibold text-xs sm:text-sm">{variant.averageRating ? parseFloat(variant?.averageRating).toFixed(1) : 0}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4 sm:mt-6">
                            <span className="text-gray-900 font-bold text-sm sm:text-xl" suppressHydrationWarning>{variant?.price?.toLocaleString() + ' ' + product?.currency}</span>
                            <Button size="sm">
                                <Link href={variant.merchantLink ?? ''}>Zum Shop</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
