import React from 'react';
import type { SoftTheme } from './SoftCard';

export interface SoftSliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    showValue?: boolean;
    valueFormatter?: (value: number) => string;
    theme?: SoftTheme;
    className?: string;
}

const trackClasses = {
    dark: 'bg-soft-dark-300',
    light: 'bg-soft-light-400',
};

const labelClasses = {
    dark: 'text-slate-400',
    light: 'text-slate-600',
};

const valueClasses = {
    dark: 'text-soft-indigo-400',
    light: 'text-soft-indigo-600',
};

const thumbClasses = {
    dark: 'bg-white shadow-soft',
    light: 'bg-white shadow-soft-light border border-slate-200',
};

/**
 * A soft slider/range input component with gradient fill.
 *
 * @param value - Current slider value
 * @param onChange - Callback when value changes
 * @param min - Minimum value (default: 0)
 * @param max - Maximum value (default: 100)
 * @param step - Step increment (default: 1)
 * @param label - Optional label text
 * @param showValue - Whether to display current value
 * @param valueFormatter - Custom value display formatter
 * @param theme - Color scheme: 'dark' (default) or 'light'
 */
const SoftSlider: React.FC<SoftSliderProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    showValue = false,
    valueFormatter = (v) => `${v}`,
    theme = 'dark',
    className = '',
}) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={`space-y-2 ${className}`}>
            {(label || showValue) && (
                <div className="flex items-center justify-between">
                    {label && (
                        <span className={`text-xs font-medium ${labelClasses[theme]}`}>
                            {label}
                        </span>
                    )}
                    {showValue && (
                        <span className={`text-xs font-mono ${valueClasses[theme]}`}>
                            {valueFormatter(value)}
                        </span>
                    )}
                </div>
            )}
            <div className="relative">
                <div className={`h-2 rounded-full ${trackClasses[theme]} overflow-hidden`}>
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-soft-indigo-500 to-soft-indigo-400 transition-all duration-150"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="
                        absolute inset-0
                        w-full h-full
                        opacity-0
                        cursor-pointer
                    "
                />
                <div
                    className={`
                        absolute top-1/2 -translate-y-1/2
                        w-4 h-4
                        rounded-full
                        ${thumbClasses[theme]}
                        pointer-events-none
                        transition-all duration-150
                        hover:scale-110
                    `}
                    style={{ left: `calc(${percentage}% - 8px)` }}
                />
            </div>
        </div>
    );
};

export default SoftSlider;
