import {Entity, Merchant, Product} from '@/types';
import Seo from '@/components/seo/seo';
import HomeLayout from '@/components/layouts/_home';
import {Button} from '@/shadcn/components/ui/button';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {fetchProducts} from "@/framework/product";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {Badge} from "@/shadcn/components/ui/badge";
import {Card, CardContent} from '@/shadcn/components/ui/card';
import {ChevronLeft, ChevronRight, Truck} from 'lucide-react';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {AspectRatio} from '@/shadcn/components/ui/aspect-ratio';
import Icon from '@/components/ui/icon';
import Link from 'next/link';
import Client from '@/framework/client';
import {ProductSlider} from "@/components/products/products-slider";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/shadcn/components/ui/table";

interface ProductPageProps {
    product: Product;
    merchants: Merchant[];
    otherProducts?: Product[];
}

const ProductPage = ({product, merchants, otherProducts}: ProductPageProps) => {
    const [currentImage, setCurrentImage] = useState(0);
    const router = useRouter();
    const {slug, variantId} = router.query;

    const variant = product.variants.find(
        (variant) => variant.slug === slug && variant.variantId === variantId
    );

    if (!variant) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Variant not found</div>;
    }

    const images = variant.images ? variant.images.slice(2) : [];

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const isOnSale = variant?.discount > 0;
    const discountPercentage = isOnSale ? Math.round(variant.discount) : null;

    useEffect(() => {
        console.log('Product:', product);
        console.log('Other Products:', otherProducts);
    }, [product, otherProducts]);

    const sameEanVariants = product.variants
        .filter((v) => v.ean === variant.ean)
        .sort((a, b) => a.price - b.price); // Sort by price, lowest first

    const formatSummaryAsBullets = (keyFeatures: string) => {
        if (!keyFeatures) {
            return [];
        }

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

    return (
        <>
            <Seo title={variant.productName} url={variant.slug} images={images}/>

            <div className="text-gray-700 bg-gray-100 ">
                <div className="grid md:grid-cols-2 gap-8 max-w-screen-3xl mx-auto px-4 py-8 ">
                    <div className="relative w-full h-auto">
                        <AspectRatio ratio={4 / 3} className="rounded-lg">
                            {images.length > 0 && (
                                <Image
                                    src={images[currentImage]}
                                    alt={`${variant.productName} - Image ${currentImage + 1}`}
                                    fill={true}
                                    className="object-contain w-full h-full"
                                />
                            )}
                        </AspectRatio>

                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-4 w-4"/>
                        </Button>

                        <div className="flex mt-4 space-x-2">
                            {images.map((img: string, index: number) => (
                                <button
                                    key={index}
                                    className={`w-16 h-16 rounded-md  ${
                                        index === currentImage ? 'ring-2 ring-primary' : ''
                                    }`}
                                    onClick={() => setCurrentImage(index)}
                                >
                                    <AspectRatio ratio={1 / 1} className="bg-muted">
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            width={64}
                                            height={64}
                                            className="object-contain w-full h-full"
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
                        <h1 className="text-md md:text-3xl font-bold mb-2">{variant.productName.replace(new RegExp(product.brandName, 'i'), '').trim()}</h1>
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
                        <Link href={variant.merchantLink} className={'mx-auto'}>
                            <Button variant={'default'} className="w-auto mb-4 text-white bg-blue-500 hover:bg-blue-600 hover:text-white">
                                <Icon name="ShoppingCart" className="mr-3 h-4 w-4"/>
                                Zum Shop
                            </Button>
                        </Link>

                        <Card className="my-6">
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-2">Besondere Merkmale:</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {formatSummaryAsBullets(variant.keyFeatures)}
                                </ul>
                            </CardContent>
                        </Card>


                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 mt-12">
                            <Truck className="h-4 w-4"/>
                            <span>{variant.deliveryTime}</span>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Weitere Informationen:</h3>
                            <ul className="list-inside space-y-1 text-sm">
                                {variant.deliveryCost && (
                                    <li><strong>Versandkosten:</strong> {variant.deliveryCost} €</li>
                                )}
                                {variant.materials && (
                                    <li><strong>Material:</strong> {variant.materials.join(', ')}</li>
                                )}
                                {variant.dimension && (
                                    <li><strong>Größe:</strong> {variant.dimension}</li>
                                )}
                                {variant.colors && (
                                    <li><strong>Farbe(n):</strong> {variant.colors.join(', ')}</li>
                                )}
                                {variant.shape && (
                                    <li><strong>Form:</strong> {variant.shape}</li>
                                )}
                            </ul>
                        </div>

                        {variant.merchantImage && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Verkäufer:</h3>
                                <Image
                                    src={((process.env.NEXT_PUBLIC_STRAPI_HOST ?? "/") + merchants.filter(el => variant.merchantId === el.merchantId)[0]?.logo_image?.data?.attributes?.url) ?? "/"}
                                    alt="Merchant"
                                    width={100}
                                    height={50}
                                    className="object-contain"
                                />
                            </div>
                        )}


                    </div>


                </div>

                {/* Table for variants with the same EAN */}
                <Card className="mb-6 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl 3xl:max-w-screen-3xl mx-auto">
                    <CardContent className="p-4 py-8">
                        <div className=" ">
                            <h3 className="text-xl font-semibold mb-4">Weitere Angebote</h3>
                            <div className="overflow-x-auto">
                                <Table className="table-fixed w-full">
                                    <TableHeader className="hidden md:table-header-group"> {/* Hide the header on mobile */}
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
                                            const merchant = merchants.find(m => m.merchantId === v.merchantId);
                                            return (
                                                <TableRow onClick={() => router.push(v.merchantLink)} key={v.variantId} className="table-row mb-4 md:mb-0 cursor-pointer"> {/* Use block layout for mobile */}
                                                    <TableCell className="w-1/6 md:w-auto table-cell">
                                                        {merchant?.logo_image?.data?.attributes?.url && (
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_STRAPI_HOST ?? "/"}${merchant.logo_image.data.attributes.url}`}
                                                                alt={merchant?.name}
                                                                width={50}
                                                                height={25}
                                                                className="object-contain"
                                                            />
                                                        )}
                                                    </TableCell>

                                                    {/* Hide the product name and delivery cost on mobile */}
                                                    <TableCell className="table-cell">{v.productName}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{v.deliveryCost ? `${v.deliveryCost} €` : 'Kostenlos'}</TableCell>

                                                    <TableCell className="flex flex-col items-end justify-center md:table-cell">
                                                        <div className="block text-lg font-bold">{v.price.toFixed(2)} €</div>
                                                        <span className={'md:hidden flex items-center gap-2'}><Icon name={'Package'} className={'h-4 w-4'}></Icon> {v.deliveryCost ? `${v.deliveryCost} €` : 'Kostenlos'}</span>
                                                    </TableCell>

                                                    <TableCell className="flex justify-end items-center md:table-cell">
                                                        <Link href={v.merchantLink}>
                                                            <Button className="bg-blue-500 text-white hover:text-white hover:bg-blue-600" size="sm" variant="outline">Zum Angebot</Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                        </div>
                    </CardContent>
                </Card>


                <Card className="mb-6 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl 3xl:max-w-screen-3xl mx-auto bg-gray-100">
                    <CardContent className="p-4 py-8">
                        <h3 className="text-xl font-semibold mb-4">Ähnliche Produkte</h3>
                        <ProductSlider products={otherProducts ?? []}/>
                    </CardContent>
                </Card>

                <Card className="mb-6 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl 3xl:max-w-screen-3xl mx-auto">
                    <CardContent className="p-4 py-8 relative">
                        <h3 className="text-xl font-semibold mb-4">Produktbeschreibung</h3>
                        <div className="prose-sm md:prose-base lg:prose-lg max-w-none bg-white ">
                            <p>{variant.originalDescription}</p>
                        </div>
                        <div className={'flex w-full items-center justify-center'}>
                            <Button variant={'outline'} size={'sm'} className="w-auto mb-6 mt-12 ">
                                <Link href={variant.merchantLink}>
                                    Weitere Informationen zum Produkt
                                </Link>
                            </Button>
                        </div>

                    </CardContent>
                </Card>


            </div>
        </>
    );
};

ProductPage.getLayout = function getLayout(page) {
    return <HomeLayout>{page}</HomeLayout>;
};

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (
    context: GetServerSidePropsContext
) => {
    const {slug, variantId} = context.query;

    const filters: any = {};

    if (slug !== undefined) {
        filters['filter'] = `variants.slug = "${slug}" AND variants.variantId = ${variantId}`;
    }

    try {
        const {data, meta} = await fetchProducts(filters);

        if (!data || data.length === 0) {
            return {
                notFound: true,
            };
        }
        const product = data[0];

        const filter = {
            populate: 'logo_image',
            filters: {
                merchantId: {
                    $in: product.variants.map(el => el.merchantId),
                },
            },
        };

        const merchants = await Client.merchants.all(filter)
            .then(response => {
                const data: Merchant[] = response.data.map((entity: Entity<Merchant>) => {
                    const id = entity.id;
                    const modifiedItem: Merchant = {
                        ...entity.attributes,
                        id: id
                    };
                    return modifiedItem;
                });
                return data;
            });

        const otherProductsFilters = {
            minPrice: 200,
            maxPrice: 2000,
            minRating: 4.8,
            pageSize: 24,
            randomize: true,
            searchTerms: '',
        };

        const {data: otherProducts} = await fetchProducts(otherProductsFilters);

        return {
            props: {
                product,
                merchants,
                otherProducts
            },
        };
    } catch (error) {
        console.error('Error fetching product:', error);

        return {
            notFound: true,
        };
    }
};

export default ProductPage;
