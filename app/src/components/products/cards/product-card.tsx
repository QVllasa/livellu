import { Button } from "@/shadcn/components/ui/button";
import { StarIcon } from '@heroicons/react/24/solid';
import { Card, CardContent } from "@/shadcn/components/ui/card";
import {Entity, Product, Variant} from "@/types";
import Link from "next/link";
import {currentBrandAtom, currentColorAtom, currentMaterialAtom} from "@/store/filters";
import {useAtom} from "jotai";

const ProductCard = (props: { product: Product }) => {
    const { product } = props;
    //i need to get the  material, brand and color of the atom so that i can show the right product:
    const [currentMaterial] = useAtom(currentMaterialAtom);
    const [currentBrand] = useAtom(currentBrandAtom);
    const [currentColor] = useAtom(currentColorAtom);



    // Extracting the first variant for display purposes
    const variant: Entity<Variant> = product.variants.data[0];

    if (!variant) {
        console.log("No variant found for product: ", product)
        return null;
    }

    return (
        <Card className="aspect-w-3 aspect-h-4">
            <CardContent className="flex items-center justify-center p-0">
                <div className="w-full h-full mx-auto bg-white rounded-lg overflow-hidden duration-300">
                    {/* Product Image */}
                    <img className="w-full h-48 object-contain p-3" src={variant?.attributes?.imageUrl} alt={variant.attributes.productName} />

                    {/* Product Details */}
                    <div className="p-4">
                        <h4 className="scroll-m-20 text-base font-semibold tracking-tight truncate">
                            {variant.attributes.productName}
                        </h4>

                        {/* Ratings and Reviews */}
                        <div className="flex items-center mt-2">
                            <StarIcon className="text-yellow-500 w-4 h-4" />
                            <StarIcon className="text-yellow-500 w-4 h-4" />
                            <StarIcon className="text-yellow-500 w-4 h-4" />
                            <StarIcon className="text-yellow-500 w-4 h-4" />
                            {/* Assuming you want a half star, you might need to create a custom SVG or use a different approach as Heroicons does not provide a half-star icon. */}
                            <StarIcon className="text-gray-300 w-4 h-4" />
                            <span className="text-gray-600 text-xs ml-1">{variant.attributes.reviews ?? 'No reviews'}</span>
                        </div>

                        {/* Pricing */}
                        <div className="flex justify-between items-center mt-6">
                            <span className="text-gray-900 font-bold text-xl">{variant.attributes.price + ' ' + product.currency}</span>
                            <Button>
                                <Link href={variant.attributes.merchantLink ?? ''}>Zum Shop</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
};
export default ProductCard;
