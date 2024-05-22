import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Slider } from '@/shadcn/components/ui/slider';
import {
    minPriceAtom,
    maxPriceAtom,
    currentMinPriceAtom,
    currentMaxPriceAtom,
} from '@/store/price';

export const PriceRangeFilter = () => {
    const [currentMinPrice, setCurrentMinPrice] = useAtom(currentMinPriceAtom);
    const [currentMaxPrice, setCurrentMaxPrice] = useAtom(currentMaxPriceAtom);
    const router = useRouter();

    const updateQueryParams = (min, max) => {
        const query = { ...router.query, minPrice: min, maxPrice: max };
        router.push({
            pathname: router.pathname,
            query: query,
        }, undefined, { shallow: true });
    };

    const handleMinPriceChange = (e) => {
        const value = Number(e.target.value);
        setCurrentMinPrice(value);
        updateQueryParams(value, currentMaxPrice);
    };

    const handleMaxPriceChange = (e) => {
        const value = Number(e.target.value);
        setCurrentMaxPrice(value);
        updateQueryParams(currentMinPrice, value);
    };

    const handleSliderChange = ([newMin, newMax]) => {
        setCurrentMinPrice(newMin);
        setCurrentMaxPrice(newMax);
        updateQueryParams(newMin, newMax);
    };

    const incrementMinPrice = () => {
        const newMin = Math.min(currentMinPrice + 10, currentMaxPrice);
        setCurrentMinPrice(newMin);
        updateQueryParams(newMin, currentMaxPrice);
    };

    const decrementMinPrice = () => {
        const newMin = Math.max(currentMinPrice - 10, 0);
        setCurrentMinPrice(newMin);
        updateQueryParams(newMin, currentMaxPrice);
    };

    const incrementMaxPrice = () => {
        const newMax = Math.min(currentMaxPrice + 10, 1000);
        setCurrentMaxPrice(newMax);
        updateQueryParams(currentMinPrice, newMax);
    };

    const decrementMaxPrice = () => {
        const newMax = Math.max(currentMaxPrice - 10, currentMinPrice);
        setCurrentMaxPrice(newMax);
        updateQueryParams(currentMinPrice, newMax);
    };

    return (
        <div className="w-64 p-4">
            <h4 className="text-sm font-bold mb-4">Price Range</h4>
            <div className="flex justify-between items-center mb-4">
                <Input
                    type="number"
                    value={currentMinPrice}
                    onChange={handleMinPriceChange}
                    placeholder="Min Price"
                />
                <span className="mx-2">-</span>
                <Input
                    type="number"
                    value={currentMaxPrice}
                    onChange={handleMaxPriceChange}
                    placeholder="Max Price"
                />
            </div>
            <div className="flex items-center mb-4">

                <Slider

                    value={[currentMinPrice, currentMaxPrice]}
                    min={0}
                    max={1000}
                    step={10}
                    onValueChange={handleSliderChange}
                    className="mx-4 flex-grow"
                />

            </div>

        </div>
    );
};
