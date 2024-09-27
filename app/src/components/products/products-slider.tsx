import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/shadcn/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Product} from "@/types";
import ProductCard from "@/components/products/cards/product-card";

export const ProductSlider = ({ products }: { products: Product[] }) => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);

    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft + clientWidth < scrollWidth);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -100, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
        }
    };

    useEffect(() => {
        // Attach the scroll event listener to check the scroll position
        if (scrollContainerRef.current) {
            scrollContainerRef.current.addEventListener("scroll", checkScrollPosition);
        }
        // Check position initially
        checkScrollPosition();

        return () => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.removeEventListener("scroll", checkScrollPosition);
            }
        };
    }, []);

    if (!products.length) return null;

    return (
        <>
            <div className={'relative flex items-center justify-center w-full px-4 mt-6'}>
                <div
                    className="relative w-auto mx-auto overflow-x-auto py-4 snap-x snap-mandatory grid grid-rows-1 grid-flow-col gap-1 lg:gap-3"
                    ref={scrollContainerRef}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className={'relative scroll-ml-12 px-1 sm:px-2 md:px-3 snap-center shrink-0 max-w-48 max-h-fit'}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Left scroll button */}
                <div
                    className={`absolute left-0 z-20 w-10 h-full bg-gradient-to-r from-gray-100 from-40% flex items-center transition-opacity duration-200 ease-in-out ${showLeftButton ? 'opacity-100 visible' : 'opacity-0'}`}
                >
                    <Button className={'absolute -left-6'} size={'icon'} variant={'outline'} onClick={scrollLeft}>
                        <ChevronLeft className={'w-4 h-4'} />
                    </Button>
                </div>

                {/* Right scroll button */}
                <div
                    className={`absolute right-0 z-20 w-10 h-full bg-gradient-to-l from-gray-100 from-40% flex items-center transition-opacity duration-300 ease-in-out ${showRightButton ? 'opacity-100 visible' : 'opacity-0'}`}
                >
                    <Button className={'absolute -right-6'} size={'icon'} variant={'outline'} onClick={scrollRight}>
                        <ChevronRight className={'w-4 h-4'} />
                    </Button>
                </div>
            </div>
        </>
    );
};
