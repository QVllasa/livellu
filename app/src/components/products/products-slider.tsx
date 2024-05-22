import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/shadcn/components/ui/carousel";
import ProductCard from "@/components/products/cards/product-card";
import {Button} from "@/shadcn/components/ui/button";
import {useProducts} from "@/framework/product";


export const ProductsSlider = (props: {filter: any}) => {
    const {filter} = props;
    const {products} = useProducts(filter);


    return (<>
        <div className={'flex justify-center mt-24'}>
            <Carousel
                opts={{
                    align: "center",
                }}
                className="w-full max-w-4xl">
                <CarouselContent>
                    {products.map((product, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <ProductCard product={product}/>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious/>
                <CarouselNext/>
            </Carousel>
        </div>
        <div className={'flex justify-center mt-12 mb-16'}>
            <Button>Mehr Produkte</Button>
        </div>
    </>)
}
