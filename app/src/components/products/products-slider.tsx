import * as React from "react";
import {useRef} from "react";
import {Button} from "@/shadcn/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Product} from "@/types";
import ProductCard from "@/components/products/cards/product-card";

export const ProductSlider = ({products}: { products: Product[] }) => {

    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({left: -100, behavior: "smooth"});
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({left: 100, behavior: "smooth"});
        }
    };


    if (!products.length) return null;

    return <>
        <div className={'relative flex  items-center justify-center w-full px-4 mt-6'}>
            <div className="relative w-auto mx-auto overflow-x-auto py-4 snap-x snap-mandatory grid grid-rows-1 grid-flow-col gap-1 lg:gap-3" ref={scrollContainerRef}>
                {products.map((product) =>
                    <div className={'relative scroll-ml-12  px-1 sm:px-2 md:px-3 snap-center  shrink-0 max-w-48 max-h-fit'}>
                        <ProductCard product={product}/>
                    </div>
                )}
            </div>
            <div className={'absolute left-0 z-20 w-10 h-full backdrop-blur flex items-center'} onClick={scrollLeft}>
                <Button size={'icon'} variant={'ghost'} onClick={scrollLeft}>
                    <ChevronLeft className={'w-4 h-4'}/>
                </Button>
            </div>
            <div className={'absolute right-0 z-20 w-10 h-full backdrop-blur flex items-center'} onClick={scrollRight}>
                <Button size={'icon'} variant={'ghost'} className={' '} >
                    <ChevronRight className={'w-4 h-4'}/>
                </Button>
            </div>
        </div>
        </>
        }



