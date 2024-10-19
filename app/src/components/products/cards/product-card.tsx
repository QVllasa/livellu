import {Card, CardContent} from "@/shadcn/components/ui/card";
import {Product, Variant} from "@/types";
import {LandingRating} from "../../../../components/landing/rating/LandingRating";
import {useRouter} from "next/router";
import {useState} from "react";
import Link from "next/link";
import {Badge} from "@/shadcn/components/ui/badge";
import {Button} from "@/shadcn/components/ui/button";
import {NotepadText, Truck} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/shadcn/components/ui/tooltip";
import {AspectRatio} from "@/shadcn/components/ui/aspect-ratio";
import Icon from "@/components/ui/icon";
import {useProductSheet} from "@/lib/context/product-sheet-context";
import {ProductImage} from "@/components/products/product-page";

const ProductCard = (props: { product: Product }) => {
    const {openSheet} = useProductSheet()
    const {product} = props;
    const router = useRouter();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isLoaded, setLoaded] = useState(true);

    console.log("product: ", product);




    const sortedVariants = [...product.variants].sort(
        (a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)
    );

    // Extract the color filter from the URL
    const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
    const colorSegment = pathSegments.find(segment => segment.startsWith('farbe:'));

    // Get the selected colors from the URL
    const selectedColors = colorSegment ? colorSegment.replace('farbe:', '').split('.') : [];

    // Find the variant that matches the selected color(s)

const matchingVariant = sortedVariants.find(
    (variant) => selectedColors.some(color => variant?.colors?.includes(color.toUpperCase()))
) || sortedVariants.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));


    // Default to the first variant if no matching variant is found
    const variant: Variant = matchingVariant || sortedVariants[0];


// Count duplicate EANs for the selected variant

    const variants = product.variants.filter((v) => v.ean === variant.ean)


    // Calculate discount percentage if the product is on sale
    const isOnSale = variant?.discount > 0;
 const isFreeShipping = parseFloat(variant?.deliveryCost) == 0;


    console.log("deliverycost: ", variant?.deliveryCost, parseFloat(variant?.deliveryCost) == 0)
    const discountPercentage = isOnSale
        ? Math.round(variant.discount)
        : null;

    if (!variant) {
        return null;
    }


    const handleOpenSheet = (e: any) => {
        e.preventDefault();
        openSheet(product, variant.variantId);
    }

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
            <Link href={variant.merchantLink ?? ''} target={'_blank'} rel={'noopener norefererrer'} >
                <Card className="transition-transform transform md:hover:scale-105 max-w-full overflow-hidden min-h-52 min-w-36">
                    <CardContent className="flex items-center justify-center p-0 relative">
                        <div className="w-full h-full mx-auto bg-white rounded-lg overflow-hidden duration-300 relative">
                            <div className={'relative w-full h-0 pt-[75%]'}>
                                <div className={'absolute top-0 left-0 h-full w-full overflow-hidden'}>
                                    <AspectRatio ratio={4 / 3} className="bg-muted pt-1">
                                        <ProductImage
                                            src={variant?.images[2]}
                                            alt={variant?.productName}
                                            width={300}
                                            height={400}
                                            // onLoad={() => setLoaded(true)}
                                            className={`pointer-events-none w-full  h-full  mx-auto object-contain ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                                            // placeholder={'blur'}
                                            // blurDataURL={variant?.thumbnail}
                                        />
                                    </AspectRatio>

                                </div>
                                <div className={'absolute inset-0  w-full h-full'}>
                                    <div className={'absolute h-full flex flex-col gap-1 top-1 right-1 items-end justify-between'}>
                                        {(isOnSale && discountPercentage) ? (
                                            <Badge className=" bg-rose-600 text-white top-1 right-1 hover:bg-rose-600">
                                                {`-${discountPercentage}% `}
                                            </Badge>
                                        ): <>
                                        <div></div>
                                        </>}
                                        {isFreeShipping && (
                                            <Badge className="flex gap-1 bg-emerald-100 text-emerald-900 text-[0.6rem]  hover:bg-rose-600">
                                                <Truck className="h-3 w-3 "/>
                                                {`Lieferung Kostenlos `}
                                            </Badge>
                                        )}
                                    </div>


                                    {!isLoaded && (
                                        <div className="  rounded-md p-4 max-w-sm w-full mx-auto mt-4">
                                            <div className="animate-pulse flex space-x-4">
                                                <div className="rounded bg-gray-300 h-48 w-full"></div>
                                                <div className="flex-1 space-y-6 py-1">
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="p-2 sm:p-4 relative">
                                {variant?.averageRating > 0 && (
                                    <div className="absolute top-0 flex items-center mt-1 sm:mt-2 text-yellow-400">
                                        <LandingRating size="xs" className="fill-yellow-400" rating={parseFloat(variant?.averageRating ?? 0)}/>
                                        <span className="ml-2 text-gray-400 font-semibold text-[0.5rem]">
                                            {variant.averageRating ? parseFloat(variant?.averageRating).toFixed(1) : 0}
                                        </span>
                                    </div>
                                )}
                                <div className="flex flex-col justify-center items-start mt-4 sm:mt-4 mb-2">
                                    {isOnSale ? (
                                        <div className={'flex justify-start items-center relative'}>
                                            <span className="text-red-600 font-semibold text-sm sm:text-base flex flex-nowrap " suppressHydrationWarning>
                                                <span className={'font-light text-gray-700 mr-1'}>ab</span> {variant?.price?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                            </span>
                                            <span className="ml-2 text-gray-400 font-semibold text-[0.65rem] line-through absolute top-0.5 -right-14" suppressHydrationWarning>
                                                {parseFloat(variant?.priceOld)?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-900 font-bold text-sm sm:text-base" suppressHydrationWarning>
                                            <span className={'font-light'}>ab</span>  {variant?.price?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                        </span>
                                    )}

                                    <span className="text-gray-400 text-[0.65rem] xs:text-xs flex gap-1 mt-1 items-center h-3" suppressHydrationWarning>
                                        {isFreeShipping ? null: <><Icon name={'Package'} className={'h-3 w-3'}/> {`${variant?.deliveryCost+'€'}`}</>}

                                    </span>
                                </div>



                                    <TooltipTrigger asChild>
                                        <h4 className="scroll-m-20 text-[0.7rem] xs:text-xs sm:text-sm font-semibold tracking-tight truncate  md:flex">
                                            {variant.title}
                                        </h4>
                                    </TooltipTrigger>
                                <div className={'flex justify-between items-center mt-2 gap-2'}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className={`hidden lg:flex w-full `}
                                    >
                                        <span>Zum Shop</span>
                                    </Button>
                                    <Button
                                        size="sm"
                                        className={'flex w-full lg:w-auto pointer-events-auto'}
                                        variant="outline"
                                        onClick={handleOpenSheet}
                                    >
                                        <span className={'text-xs text-gray-700'}>{variants.length}</span>

                                        <NotepadText className="h-4 w-4 text-gray-700"/>
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
                <TooltipContent className={'bg-gray-100 text-gray-700 absolute -left-24 top-8 w-72'} key={variant.productId} >
                    <p className={'text-xs font-light'}>{variant.productName}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ProductCard;
