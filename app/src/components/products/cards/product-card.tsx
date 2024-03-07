import {Button} from "@/shadcn/components/ui/button";
import {StarIcon} from '@heroicons/react/24/solid'
import {Card, CardContent} from "@/shadcn/components/ui/card";


const ProductCard = () => {
    return (
        <Card className="aspect-w-3 aspect-h-4">
            <CardContent className="flex items-center justify-center p-0">
                <div className="w-full h-full mx-auto bg-white rounded-lg overflow-hidden  duration-300">
                    {/* Product Image */}
                    <img className="w-full h-48 object-cover object-center" src="https://picsum.photos/300/300" alt="Placeholder"/>

                    {/* Product Details */}
                    <div className="p-4">
                        <h4 className="scroll-m-20 text-base font-semibold tracking-tight">Organize Basic Set (Walnut)</h4>

                        {/* Ratings and Reviews */}
                        <div className="flex items-center mt-2">
                            <StarIcon className="text-yellow-500 w-4 h-4"/>
                            <StarIcon className="text-yellow-500 w-4 h-4"/>
                            <StarIcon className="text-yellow-500 w-4 h-4"/>
                            <StarIcon className="text-yellow-500 w-4 h-4"/>
                            {/* Assuming you want a half star, you might need to create a custom SVG or use a different approach as Heroicons does not provide a half-star icon. */}
                            <StarIcon className="text-gray-300 w-4 h-4"/>
                            <span className="text-gray-600 text-xs ml-1">38 reviews</span>
                        </div>

                        {/* Pricing */}
                        <div className="flex justify-between items-center mt-6">
                            <span className="text-gray-900 font-bold text-xl">$149</span>
                            <Button>Zum Shop</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>


    )
};
export default ProductCard;