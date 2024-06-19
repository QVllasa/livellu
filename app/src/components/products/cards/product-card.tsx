import { Button } from "@/shadcn/components/ui/button";
import { StarIcon } from '@heroicons/react/24/solid';
import { Card, CardContent } from "@/shadcn/components/ui/card";
import { Color, Entity, Product, Variant } from "@/types";
import Link from "next/link";
import { currentBrandAtom, currentColorAtom, currentMaterialAtom } from "@/store/filters";
import { useAtom } from "jotai";
import {LandingRating} from "../../../../components/landing/rating/LandingRating";

const ProductCard = (props: { product: Product }) => {
    const { product } = props;
    // Getting the material, brand, and color from the atoms
    const [currentMaterial] = useAtom(currentMaterialAtom);
    const [currentBrand] = useAtom(currentBrandAtom);
    const [currentColor] = useAtom(currentColorAtom);

    const colorIds = [(currentColor && currentColor.id), ...(currentColor?.child_colors?.data ? currentColor?.child_colors?.data.map((color: Color) => color.id) : [])]

    // Filter the variants to find the one that matches the current color
    const matchingVariant = product.variants.data.find(
        (variant) => colorIds.includes(Number(variant.attributes.originalColor))
    );

    // If no matching variant is found, use the first variant as a fallback
    const variant: Entity<Variant> = matchingVariant || product.variants.data[0];


    if (!variant) {
        return null;
    }


    return (
        <Card
            className="aspect-w-3 aspect-h-4"
            onMouseEnter={() => console.log("Hovered product:", product)}
        >
            <CardContent className="flex items-center justify-center p-0">
                <div className="w-full h-full mx-auto bg-white rounded-lg overflow-hidden duration-300">
                    {/* Product Image */}
                    <img className="w-full h-48 object-contain p-3" src={variant?.attributes?.altImageUrl} alt={variant.attributes.productName} />

                    {/* Product Details */}
                    <div className="p-4">
                        <h4 className="scroll-m-20 text-base font-semibold tracking-tight truncate">
                            {variant.attributes.productName}
                        </h4>

                        {/* Ratings and Reviews */}
                        {variant.attributes.averageRating ? (
                            <div className="flex items-center mt-2 text-yellow-400">
                                <LandingRating className={'fill-yellow-400'} rating={variant.attributes.averageRating} />
                                <span className="ml-2 text-gray-400 font-semibold text-xs">{parseFloat(variant.attributes.averageRating).toFixed(1) }</span>
                            </div>
                        ) : null}

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
    );
};

export default ProductCard;
