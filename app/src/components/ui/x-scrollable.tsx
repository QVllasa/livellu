import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/shadcn/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";

export const XScrollable = ({children}) => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);


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

    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft + clientWidth < scrollWidth);
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
    }, [scrollContainerRef.current]);

    return <>
        <div className={'relative flex  items-center justify-center w-full '}>
            <div className="  relative flex w-auto mx-auto overflow-x-auto scroll-pr-36 scroll-pl-36 pr-26 py-4 snap-x snap-mandatory " ref={scrollContainerRef}>
                {children}
            </div>
            {/* Left scroll button */}
            <div
                className={`absolute left-0 z-20 w-10 h-full bg-gradient-to-r from-gray-100 from-40% flex items-center transition-opacity duration-200 ease-in-out ${showLeftButton ? 'opacity-100 visible' : 'opacity-0'}`}
            >
                <Button className={'absolute left-0'} size={'icon'} variant={'outline'} onClick={scrollLeft}>
                    <ChevronLeft className={'w-4 h-4'} />
                </Button>
            </div>

            {/* Right scroll button */}
            <div
                className={`absolute right-0 z-20 w-10 h-full bg-gradient-to-l from-gray-100 from-40% flex items-center transition-opacity duration-300 ease-in-out ${showRightButton ? 'opacity-100 visible' : 'opacity-0'}`}
            >
                <Button className={'absolute right-0'} size={'icon'} variant={'outline'} onClick={scrollRight}>
                    <ChevronRight className={'w-4 h-4'} />
                </Button>
            </div>
        </div>
    </>
}
