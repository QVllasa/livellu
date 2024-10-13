import * as React from 'react';
import {Suspense, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/shadcn/components/ui/button';
import {Badge} from '@/shadcn/components/ui/badge';
import {Card, CardContent} from '@/shadcn/components/ui/card';
import {ChevronLeft, ChevronRight, Truck} from 'lucide-react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/shadcn/components/ui/table';
import Seo from '@/components/seo/seo';
import {ProductSlider} from '@/components/products/products-slider';
import {Drawer, DrawerContent, DrawerHeader} from '@/shadcn/components/ui/drawer';
import {useMediaQuery} from 'usehooks-ts';
import {Sheet, SheetContent} from '@/shadcn/components/ui/sheet';
import {useProductSheet} from '@/lib/context/product-sheet-context';
import {Merchant, Product, Variant} from "@/types";
import Icon from "@/components/ui/icon";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import dynamic from "next/dynamic";
import {CarouselApi} from "@/shadcn/components/ui/carousel";

const Carousel = dynamic(() => import('@/shadcn/components/ui/carousel').then(mod => mod.Carousel), { ssr: false });
const CarouselContent = dynamic(() => import('@/shadcn/components/ui/carousel').then(mod => mod.CarouselContent), { ssr: false });
const CarouselItem = dynamic(() => import('@/shadcn/components/ui/carousel').then(mod => mod.CarouselItem), { ssr: false });
const AspectRatio = dynamic(() => import('@/shadcn/components/ui/aspect-ratio').then(mod => mod.AspectRatio), { ssr: false });



const ProductDrawer = dynamic(() => Promise.resolve(ProductDrawerComponent), { ssr: false });
const ProductSheet = dynamic(() => Promise.resolve(ProductSheetComponent), { ssr: false });



const ProductPage: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false); // To track if the component has mounted
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const {isOpen, closeSheet, activeProduct, variantId, loading, otherProducts, merchants} = useProductSheet();


    useEffect(() => {
        // Set isMounted to true once the component mounts
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        // Avoid rendering any component based on media query until it's mounted on the client
        return null; // You can replace this with a loading spinner if you'd like
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!activeProduct) {
        return <div>Product not found</div>;
    }

    const variant = activeProduct?.variants?.find((v) => v.variantId === variantId);

    if (!variant) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Variant not found</div>;
    }


    const handleSheetClose = () => closeSheet();

    return (
        <>
            <Suspense>
                {!isMobile ? (
                    <ProductSheet isOpen={isOpen}  variant={variant} product={activeProduct} otherProducts={otherProducts} merchants={merchants} handleSheetClose={handleSheetClose}/>
                ) : (
                    <ProductDrawer isOpen={isOpen}  variant={variant} product={activeProduct} otherProducts={otherProducts} merchants={merchants} handleSheetClose={handleSheetClose}/>
                )}
            </Suspense>

        </>
    );
};

export default ProductPage;

const ProductSheetComponent: React.FC = ({isOpen, variant, product, otherProducts, merchants, handleSheetClose}: {
    isOpen: boolean,
    variant: Variant,
    product: Product,
    otherProducts: Product[],
    merchants: Merchant[],
    handleSheetClose: () => {},
    activateAnimation: boolean
}) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [count, setCount] = useState(0);
    const router = useRouter();
    const [validImages, setValidImages] = useState<string[]>([]);
    const images = variant.images ? variant.images.slice(2) : [];

    const checkImageExists = async (url: string): Promise<boolean> => {
        try {
            const response = await fetch(url, {method: 'HEAD'});
            return response.ok; // returns true if status is 200-299
        } catch (error) {
            return false; // return false if there's an error (e.g., network issues)
        }
    };

    // Function to filter and keep only valid images
    const filterValidImages = async () => {
        const valid = await Promise.all(
            images.map(async (img) => {
                const exists = await checkImageExists(img);
                return exists ? img : null;
            })
        );
        setValidImages(valid.filter(Boolean) as string[]);  // Filter out null values
    };

    useEffect(() => {
        filterValidImages();  // Validate images on component mount
    }, []);


    const isOnSale = variant?.discount > 0;
    const discountPercentage = isOnSale ? Math.round(variant.discount) : null;

    const sameEanVariants = product.variants
        .filter((v) => v.ean === variant.ean)
        .sort((a, b) => a.price - b.price); // Sort by price, lowest first

    // Handlers for next and previous image
    const nextImage = () => api?.scrollNext();
    const prevImage = () => api?.scrollPrev();

    // Initialize the carousel API when the component mounts
    useEffect(() => {
        if (!api) return;

        // Set the total count of images and the current selected image index
        setCount(api.scrollSnapList().length);
        setCurrentImage(api.selectedScrollSnap() + 1);

        // Update the selected image on carousel selection change
        api.on("select", () => {
            setCurrentImage(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const formatSummaryAsBullets = (keyFeatures: string) => {
        if (!keyFeatures) return [];

        const parts = keyFeatures.split('*').filter(Boolean);
        const bulletPoints = [];

        for (let i = 0; i < parts.length; i += 2) {
            const boldText = parts[i].replace(/:/g, '').trim();
            const normalText = parts[i + 1]?.trim() || '';

            if (boldText && normalText) {
                bulletPoints.push(
                    <li key={i} className="mb-1 text-gray-700">
                        <strong>{boldText}:</strong> {normalText}
                    </li>
                );
            }
        }

        return bulletPoints;
    };

    return <>
        <Sheet open={isOpen} onOpenChange={(open) => (open ? handleSheetClose() : handleSheetClose())}>
            <SheetContent
                side="right"
                className={`bg-gray-100 h-full overflow-y-auto sm:max-w-[980px]`}
            >
                <Seo title={variant.productName} url={variant.variantId.toString()} images={images}/>
                <div className="text-gray-700 bg-gray-100 h-full ">
                    <div className={'relative h-12 w-full flex justify-end'}>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleSheetClose}
                        >
                            <span className="sr-only">Close</span>
                            <Icon name={'X'} className="h-4 w-4"/>
                        </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-full mx-auto px-4 py-8">
                        <div className="relative w-full h-auto">
                            {validImages.length > 0 && (
                                <Carousel setApi={setApi}>
                                    <CarouselContent>
                                        {validImages.map((img, index) => (
                                            <CarouselItem key={index}>
                                                <AspectRatio ratio={4 / 3} className="rounded-lg">
                                                    <Image
                                                        src={validImages[index]}
                                                        alt={`${variant.productName} - Image ${currentImage + 1}`}
                                                        width={800}
                                                        height={600}
                                                        className={'object-contain w-full h-full'}
                                                    />
                                                </AspectRatio>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2"
                                        onClick={prevImage}
                                    >
                                        <ChevronLeft className="h-4 w-4"/>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2"
                                        onClick={nextImage}
                                    >
                                        <ChevronRight className="h-4 w-4"/>
                                    </Button>
                                </Carousel>
                            )}

                            <div className="flex mt-4 space-x-2">
                                {validImages.map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        className={`w-16 h-16 rounded-md`}
                                        onClick={() => api?.scrollTo(index)}
                                    >
                                        <AspectRatio ratio={1 / 1} className="bg-muted">
                                            <Image
                                                src={img} alt={`Thumbnail ${index + 1}`} width={64} height={64} className="object-contain w-full h-full"
                                            />
                                        </AspectRatio>
                                    </button>
                                ))}
                            </div>

                            {isOnSale && discountPercentage && (
                                <Badge className="absolute bg-rose-600 text-white top-1 right-1 hover:bg-rose-600">
                                    {`-${discountPercentage}%`}
                                </Badge>
                            )}
                        </div>

                        <div>
                            <h2 className="text-xs md:text-1xl font-bold mb-2">{product.brandName}</h2>
                            <h1 className="text-md md:text-3xl font-bold mb-2">
                                {variant.productName.replace(new RegExp(product.brandName, 'i'), '').trim()}
                            </h1>

                            <div className="flex items-center mb-4">
                                <Badge variant="secondary">{variant.originalColor}</Badge>
                            </div>

                            <div className="text-2xl font-bold mb-4">
                                {isOnSale ? (
                                    <div className="flex items-center">
                                        <span className="text-red-600">{`${variant.price.toFixed(2)} €`}</span>
                                        <span className="ml-2 text-gray-400 line-through">{`${parseFloat(variant.priceOld)?.toFixed(2)} €`}</span>
                                    </div>
                                ) : (
                                    `${variant.price.toFixed(2)} €`
                                )}
                            </div>

                            <Link href={variant.merchantLink}>
                                <Button className="w-auto mb-4 text-white bg-blue-500 hover:bg-blue-600">Zum Shop</Button>
                            </Link>

                            <Card className="my-6">
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-2">Besondere Merkmale:</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">{formatSummaryAsBullets(variant.keyFeatures)}</ul>
                                </CardContent>
                            </Card>

                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 mt-12">
                                <Truck className="h-4 w-4"/>
                                <span>{variant.deliveryTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Other Products Table */}
                    <Card className="mb-6 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
                        <CardContent className="p-4 py-8">
                            <h3 className="text-xl font-semibold mb-4">Weitere Angebote</h3>
                            <div className="overflow-x-auto">
                                <Table className="table-fixed w-full">
                                    <TableHeader className="hidden md:table-header-group">
                                        <TableRow>
                                            <TableHead className="w-1/12">Händler</TableHead>
                                            <TableHead className="w-2/6">Produktname</TableHead>
                                            <TableHead className="w-1/6">Versandkosten</TableHead>
                                            <TableHead className="w-1/6">Preis</TableHead>
                                            <TableHead className="w-1/6">Link</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sameEanVariants.map((v) => {
                                            const merchant = merchants.find((m) => m.merchantId === v.merchantId);
                                            return (
                                                <TableRow key={v.variantId} className="cursor-pointer" onClick={() => router.push(v.merchantLink)}>
                                                    <TableCell className="w-1/6 md:w-auto table-cell">
                                                        {merchant?.logo_image?.data?.attributes?.url && (
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_STRAPI_HOST ?? '/'}${merchant.logo_image.data.attributes.url}`}
                                                                width={50}
                                                                height={25}
                                                                alt={merchant?.name ?? 'merchant-logo'}
                                                                className="object-contain"
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="table-cell">{v.productName}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{v.deliveryCost ? `${v.deliveryCost} €` : 'Kostenlos'}</TableCell>
                                                    <TableCell className="flex flex-col items-end justify-center md:table-cell">
                                                        <div className="block text-lg font-bold">{v.price.toFixed(2)} €</div>
                                                        <span className="md:hidden flex items-center gap-2">
                                                            <Truck className="h-4 w-4"/> {v.deliveryCost ? `${v.deliveryCost} €` : 'Kostenlos'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="flex justify-end items-center md:table-cell">
                                                        <Link href={v.merchantLink}>
                                                            <Button className="bg-blue-500 text-white hover:bg-blue-600" size="sm" variant="outline">
                                                                Zum Angebot
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Similar Products Slider */}
                    <Card className="mb-6 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto bg-gray-100">
                        <CardContent className="p-4 py-8">
                            <h3 className="text-xl font-semibold mb-4">Ähnliche Produkte</h3>
                            <ProductSlider products={otherProducts ?? []}/>
                        </CardContent>
                    </Card>

                    {/* Product Description */}
                    <Card className="mb-6 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
                        <CardContent className="p-4 py-8 relative">
                            <h3 className="text-xl font-semibold mb-4">Produktbeschreibung</h3>
                            <div className="prose-sm md:prose-base lg:prose-lg max-w-none bg-white">
                                <p>{variant.originalDescription}</p>
                            </div>
                            <div className={'flex w-full items-center justify-center'}>
                                <Button variant={'outline'} size={'sm'} className="w-auto mb-6 mt-12">
                                    <Link href={variant.merchantLink}>Weitere Informationen zum Produkt</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SheetContent>
        </Sheet>
    </>
}

const ProductDrawerComponent: React.FC = ({isOpen, variant, product, otherProducts, merchants, handleSheetClose}: {
    isOpen: boolean,
    variant: Variant,
    product: Product,
    otherProducts: Product[],
    merchants: Merchant[],
    handleSheetClose: () => {},
    activateAnimation: boolean
}) => {
    const [currentImage, setCurrentImage] = useState(0);
    const router = useRouter();
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [count, setCount] = useState(0);
    const [validImages, setValidImages] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState<boolean>(true);
    const images = variant.images ? variant.images.slice(2) : [];
    const [carouselMounted, setCarouselMounted] = useState(false);

    useEffect(() => {
        // Delay the loading of the carousel component to make sure everything is ready
        const timer = setTimeout(() => {
            setCarouselMounted(true);
        }, 500); // Delay by 500ms or adjust the timing based on your needs

        return () => clearTimeout(timer); // Clean up the timer
    }, []);




    const checkImageExists = async (url: string): Promise<boolean> => {
        try {
            const response = await fetch(url, {method: 'HEAD'});
            return response.ok; // returns true if status is 200-299
        } catch (error) {
            return false; // return false if there's an error (e.g., network issues)
        }
    };

    // Function to filter and keep only valid images
    const filterValidImages = async () => {
        setLoadingImages(true);
        const valid = await Promise.all(
            images.map(async (img) => {
                const exists = await checkImageExists(img);
                return exists ? img : null;
            })
        );
        setValidImages(valid.filter(Boolean) as string[]);  // Filter out null values
    };

    useEffect(() => {
        const loadImages = async () => {
            await filterValidImages(); // Load valid images first
            setLoadingImages(false);   // Then, allow the carousel to render
        };
        loadImages();
    }, [variant]);

    useEffect(() => {
        console.log("Valid images:", validImages);
    }, [validImages])

    const isOnSale = variant?.discount > 0;
    const discountPercentage = isOnSale ? Math.round(variant.discount) : null;


    const sameEanVariants = product.variants
        .filter((v) => v.ean === variant.ean)
        .sort((a, b) => a.price - b.price); // Sort by price, lowest first

    // Handlers for next and previous image
    const nextImage = () => api?.scrollNext();
    const prevImage = () => api?.scrollPrev();

    const formatSummaryAsBullets = (keyFeatures: string) => {
        if (!keyFeatures) return [];

        const parts = keyFeatures.split('*').filter(Boolean);
        const bulletPoints = [];

        for (let i = 0; i < parts.length; i += 2) {
            const boldText = parts[i].replace(/:/g, '').trim();
            const normalText = parts[i + 1]?.trim() || '';

            if (boldText && normalText) {
                bulletPoints.push(
                    <li key={i} className="mb-1 text-gray-700">
                        <strong>{boldText}:</strong> {normalText}
                    </li>
                );
            }
        }

        return bulletPoints;
    };

    // Initialize the carousel API when the component mounts

    // Function to handle scrolling to next/prev image
    const scrollToImage = (direction: 'next' | 'prev') => {
        const container = document.getElementById('image-scroll-container');
        if (container) {
            const scrollAmount = direction === 'next' ? container.clientWidth : -container.clientWidth;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return <>
        <Drawer open={isOpen} onOpenChange={(open) => (open ? null : handleSheetClose())}>
            <DrawerContent className="bg-white min-h-auto max-h-[87vh] ">
                <DrawerHeader>
                    <div className={'grid grid-cols-3 items-center'}>
                        <div></div>
                        <div className="mx-auto  h-2 w-[100px] rounded-full bg-gray-300 dark:bg-slate-800"/>
                        <Button
                            variant="outline"
                            size="icon"
                            className={'ml-auto'}
                            onClick={handleSheetClose}
                        >
                            <span className="sr-only">Close</span>
                            <Icon name={'X'} className="h-4 w-4"/>
                        </Button>
                    </div>

                </DrawerHeader>
                <Seo title={variant.productName} url={variant.variantId.toString()} images={images}/>
                <ScrollArea className="text-gray-700 mt-4 h-[80vh] px-4 py-2">
                    <div className="grid md:grid-cols-2 gap-8 max-w-full mx-auto">
                        <div className="relative w-full h-auto">
                            <h2 className="text-xs md:text-1xl font-bold mb-2 text-gray-500">{product.brandName}</h2>
                            <h1 className="text-md md:text-3xl font-bold mb-6">
                                {variant.productName.replace(new RegExp(product.brandName, 'i'), '').trim()}
                            </h1>


                            {/*<div className="flex items-center mb-4">*/}
                            {/*    <Badge variant="secondary">{variant.originalColor}</Badge>*/}
                            {/*</div>*/}
                            <div className="relative w-auto h-auto">
                                {
                                    loadingImages ? (<Skeleton className={'h-64 w-full'}/>)
                                        :
                                        <>
                                            {validImages.length > 0 && (
                                                <div className="relative">
                                                    <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth" id="image-scroll-container">
                                                        {validImages.map((img, index) => (
                                                            <div key={index} className="snap-center flex-shrink-0 w-full">
                                                                <Image src={img} alt={`${variant.productName} - Image ${index + 1}`} width={300} height={200} className="object-contain w-full h-auto"/>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Button variant="outline" size="icon" className="absolute left-0 top-1/2 transform -translate-y-1/2" onClick={() => scrollToImage('prev')}>
                                                        <ChevronLeft className="h-4 w-4"/>
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="absolute right-0 top-1/2 transform -translate-y-1/2" onClick={() => scrollToImage('next')}>
                                                        <ChevronRight className="h-4 w-4"/>
                                                    </Button>
                                                </div>)}
                                            {isOnSale && discountPercentage && (
                                                <Badge className="absolute bg-rose-600 text-white top-1 right-1 hover:bg-rose-600">
                                                    {`-${discountPercentage}%`}
                                                </Badge>
                                            )}
                                        </>

                                }


                            </div>


                            {loadingImages ?
                                <>
                                    <div className={'grid grid-cols-5 gap-3'}>
                                        <Skeleton className={'h-16 w-16'}/>
                                        <Skeleton className={'h-16 w-16'}/>
                                        <Skeleton className={'h-16 w-16'}/>
                                    </div>

                                </>
                                :
                                <>
                                    <div className="flex mt-4 gap-2">
                                        {validImages.map((img: string, index: number) => (
                                            <button
                                                key={index}
                                                className={`w-16 h-16 rounded-md`}
                                                onClick={() => api?.scrollTo(index)}
                                            >

                                                    <Image src={img} alt={`Thumbnail ${index + 1}`} width={64} height={64} className="object-contain w-full h-full"/>

                                            </button>
                                        ))}
                                    </div>
                                </>
                            }


                        </div>

                        <div className="text-2xl font-bold mb-4">
                            {isOnSale ? (
                                <div className="flex items-center">
                                    <span className="text-red-600">{`${variant.price.toFixed(2)} €`}</span>
                                    <span className="ml-2 text-gray-400 line-through">{`${parseFloat(variant.priceOld)?.toFixed(2)} €`}</span>
                                </div>
                            ) : (
                                `${variant.price.toFixed(2)} €`
                            )}
                        </div>

                        <Link href={variant.merchantLink}>
                            <Button className="w-auto mb-4 text-white bg-blue-500 hover:bg-blue-600">Zum Shop</Button>
                        </Link>
                    </div>
                    <Card className="my-6">
                        <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">Besondere Merkmale:</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">{formatSummaryAsBullets(variant.keyFeatures)}</ul>
                        </CardContent>
                    </Card>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 mt-12">
                        <Truck className="h-4 w-4"/>
                        <span>{variant.deliveryTime}</span>
                    </div>
                    {/* Other Products Table */}
                    <Card className="mb-6 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
                        <CardContent className="p-4 py-8">
                            <h3 className="text-xl font-semibold mb-4">Weitere Angebote</h3>
                            <div className="overflow-x-auto">
                                <Table className="table-fixed w-full">
                                    <TableHeader className="hidden md:table-header-group">
                                        <TableRow>
                                            <TableHead className="w-1/12">Händler</TableHead>
                                            <TableHead className="w-2/6">Produktname</TableHead>
                                            <TableHead className="w-1/6">Versandkosten</TableHead>
                                            <TableHead className="w-1/6">Preis</TableHead>
                                            <TableHead className="w-1/6">Link</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sameEanVariants.map((v) => {
                                            const merchant = merchants.find((m) => m.merchantId === v.merchantId);
                                            return (
                                                <TableRow key={v.variantId} className="cursor-pointer" onClick={() => router.push(v.merchantLink)}>
                                                    <TableCell className="w-1/6 md:w-auto table-cell">
                                                        {merchant?.logo_image?.data?.attributes?.url && (
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_STRAPI_HOST ?? '/'}${merchant.logo_image.data.attributes.url}`}
                                                                width={50}
                                                                height={25}
                                                                alt={merchant?.name ?? 'merchant-logo'}
                                                                className="object-contain"
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="table-cell">{v.productName}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{v.deliveryCost ? `${v.deliveryCost} €` : 'Kostenlos'}</TableCell>
                                                    <TableCell className="flex flex-col items-end justify-center md:table-cell">
                                                        <div className="block text-lg font-bold">{v.price.toFixed(2)} €</div>
                                                        <span className="md:hidden flex items-center gap-2">
                                                            <Truck className="h-4 w-4"/> {v.deliveryCost ? `${v.deliveryCost} €` : 'Kostenlos'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="flex justify-end items-center md:table-cell">
                                                        <Link href={v.merchantLink}>
                                                            <Button className="bg-blue-500 text-white hover:bg-blue-600" size="sm" variant="outline">
                                                                Zum Angebot
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Similar Products Slider */}
                    <Card className="mb-6 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto bg-gray-100">
                        <CardContent className="p-4 py-8">
                            <h3 className="text-xl font-semibold mb-4">Ähnliche Produkte</h3>
                            <ProductSlider products={otherProducts ?? []}/>
                        </CardContent>
                    </Card>
                    {/* Product Description */}
                    <Card className="mb-6 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
                        <CardContent className="p-4 py-8 relative">
                            <h3 className="text-xl font-semibold mb-4">Produktbeschreibung</h3>
                            <div className="prose-sm md:prose-base lg:prose-lg max-w-none bg-white">
                                <p>{variant.originalDescription}</p>
                            </div>
                            <div className={'flex w-full items-center justify-center'}>
                                <Button variant={'outline'} size={'sm'} className="w-auto mb-6 mt-12">
                                    <Link href={variant.merchantLink}>Weitere Informationen zum Produkt</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    </>
}


export const ProductImage = ({src, alt, width, height, className, srcSet, onLoad, placeholder, blurDataURL}: {
    src: string,
    alt?: string,
    width?: number,
    height?: number,
    className?: string,
    srcSet?: string,
    onLoad?: () => void,
    placeholder?: string,
    blurDataURL?: string
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleImageError = () => {
        setIsVisible(false);  // Hide the image when an error occurs
    };

    if (!isVisible) return null;  // Do not render the image element if it's hidden

    return (
        <Image
            src={src}
            alt={alt}
            srcSet={srcSet}
            onLoad={onLoad}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            width={width}
            height={height}
            onError={handleImageError}
            className={className} //"object-contain w-full h-full"
        />
    );
};
