import React, {useEffect, useState} from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {cn} from "@/lib/utils";
import {Input} from "@/shadcn/components/ui/input"; // Import Input component from ShadCN design system

type SliderProps = {
    className?: string;
    min: number;
    max: number;
    step: number;
    formatLabel?: (value: number) => string;
    value?: number[] | readonly number[];
    onValueChange?: (values: number[]) => void;
    onValueCommit?: (values: number[]) => void;
};

const Slider = React.forwardRef(
    (
        {
            className,
            min,
            max,
            step,
            formatLabel,
            value,
            onValueChange,
            onValueCommit,
            ...props
        }: SliderProps,
        ref
    ) => {
        const initialValue = Array.isArray(value) ? value : [min, max];
        const [localValues, setLocalValues] = useState(initialValue);
        const [minInput, setMinInput] = useState(initialValue[0]);
        const [maxInput, setMaxInput] = useState(initialValue[1]);

        useEffect(() => {
            setLocalValues(Array.isArray(value) ? value : [min, max]);
            setMinInput(Array.isArray(value) ? value[0] : min);
            setMaxInput(Array.isArray(value) ? value[1] : max);
        }, [min, max, value]);

        const handleSliderChange = (newValues: number[]) => {
            setLocalValues(newValues);
            setMinInput(newValues[0]);
            setMaxInput(newValues[1]);
            if (onValueChange) {
                onValueChange(newValues);
            }
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
            const newValue = Number(e.target.value);
            const updatedValues = [...localValues];
            updatedValues[index] = newValue;

            if (index === 0) setMinInput(newValue);
            if (index === 1) setMaxInput(newValue);

            if (newValue >= min && newValue <= max) {
                handleSliderChange(updatedValues);
            }
        };

        const handleValueCommit = () => {
            if (onValueCommit) {
                onValueCommit(localValues);
            }
        };

        return (
            <div className="w-full">
                <div className="flex justify-between items-center gap-2 mb-12">
                    <Input
                        type="number"
                        value={minInput}
                        onChange={(e) => handleInputChange(e, 0)}
                        className="w-36 text-center"
                        min={min}
                        max={max}
                    />
                    <span>
                        -
                    </span>
                    <Input
                        type="number"
                        value={maxInput}
                        onChange={(e) => handleInputChange(e, 1)}
                        className="w-36 text-center"
                        min={min}
                        max={max}
                    />
                </div>
                <SliderPrimitive.Root
                    ref={ref as React.RefObject<HTMLDivElement>}
                    min={min}
                    max={max}
                    step={step}
                    value={localValues}
                    onValueChange={handleSliderChange}
                    onValueCommit={handleValueCommit}
                    className={cn(
                        "relative flex w-full touch-none select-none items-center mb-6",
                        className
                    )}
                    {...props}
                >
                    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-300">
                        <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
                    </SliderPrimitive.Track>
                    {localValues.map((value, index) => (
                        <React.Fragment key={index}>
                            <div
                                className="absolute text-center"
                                style={{
                                    left: `calc(${((value - min) / (max - min)) * 100}% ${
                                        index === 0 ? "- 0px" : "- 25px"
                                    })`,
                                    top: `14px`,
                                }}
                            >
                                <span
                                    className="text-sm flex truncate bg-white p-1 rounded-md shadow"
                                    suppressHydrationWarning
                                >
                                    {formatLabel ? formatLabel(value) : value}
                                </span>
                            </div>
                            <SliderPrimitive.Thumb
                                className="block h-6 w-6 rounded-full border-2 border-blue-500 bg-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                                onPointerUp={handleValueCommit}
                            />
                        </React.Fragment>
                    ))}
                </SliderPrimitive.Root>
            </div>
        );
    }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
