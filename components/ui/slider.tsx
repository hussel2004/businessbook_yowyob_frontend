'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    thumbClassName?: string;
    trackClassName?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, thumbClassName, trackClassName, ...props }, ref) => {
        return (
            <input
                type="range"
                className={cn(
                    'w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Slider.displayName = 'Slider';

export { Slider };
