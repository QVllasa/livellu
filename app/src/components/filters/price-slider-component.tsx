import React, { useEffect, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

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

        useEffect(() => {
            setLocalValues(Array.isArray(value) ? value : [min, max]);
        }, [min, max, value]);

        const handleValueChange = (newValues: number[]) => {
            setLocalValues(newValues);
            if (onValueChange) {
                onValueChange(newValues);
            }
        };

        const handleValueCommit = () => {
            if (onValueCommit) {
                onValueCommit(localValues);
            }
        };

        return (
            <SliderPrimitive.Root
                ref={ref as React.RefObject<HTMLDivElement>}
                min={min}
                max={max}
                step={step}
                value={localValues}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
                className={cn(
                    "relative flex w-full touch-none select-none mb-6 items-center",
                    className
                )}
                {...props}
            >
                <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
                    <SliderPrimitive.Range className="absolute h-full bg-gray-400" />
                </SliderPrimitive.Track>
                {localValues.map((value, index) => (
                    <React.Fragment key={index}>
                        <div
                            className="absolute text-center"
                            style={{
                                left: `calc(${((value - min) / (max - min)) * 100}% ${index == 0 ? '- 0px' : '- 25px'})`,
                                top: `10px`,
                            }}
                        >
                            <span className="text-xs flex truncate">
                                {formatLabel ? formatLabel(value) : value}
                            </span>
                        </div>
                        <SliderPrimitive.Thumb
                            className="block h-4 w-4 rounded-full border border-primary/50 bg-blue-500 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            onPointerUp={handleValueCommit}
                        />
                    </React.Fragment>
                ))}
            </SliderPrimitive.Root>
        );
    }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
