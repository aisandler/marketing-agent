import React from 'react';
import type { SoftTheme } from './SoftCard';

export interface SoftToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    size?: 'sm' | 'md';
    disabled?: boolean;
    theme?: SoftTheme;
}

const sizeConfig = {
    sm: {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'peer-checked:translate-x-4',
    },
    md: {
        track: 'w-10 h-5',
        thumb: 'w-4 h-4',
        translate: 'peer-checked:translate-x-5',
    },
};

const trackClasses = {
    dark: 'bg-soft-dark-300 peer-checked:bg-soft-indigo-500 peer-checked:shadow-soft-glow',
    light: 'bg-soft-light-400 peer-checked:bg-soft-indigo-500 peer-checked:shadow-soft-glow-light',
};

const thumbClasses = {
    dark: 'bg-slate-400 peer-checked:bg-white',
    light: 'bg-white peer-checked:bg-white shadow-soft-light',
};

const labelClasses = {
    dark: 'text-slate-400',
    light: 'text-slate-600',
};

/**
 * A soft toggle switch component.
 *
 * @param checked - Whether toggle is on
 * @param onChange - Callback when toggle state changes
 * @param label - Optional text label
 * @param size - Toggle size: 'sm' or 'md'
 * @param theme - Color scheme: 'dark' (default) or 'light'
 */
const SoftToggle: React.FC<SoftToggleProps> = ({
    checked,
    onChange,
    label,
    size = 'md',
    disabled = false,
    theme = 'dark',
}) => {
    const config = sizeConfig[size];

    return (
        <label className={`
            inline-flex items-center gap-3
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => !disabled && onChange(e.target.checked)}
                    disabled={disabled}
                />
                <div
                    className={`
                        ${config.track}
                        rounded-full
                        ${trackClasses[theme]}
                        transition-all duration-300 ease-out
                    `}
                />
                <div
                    className={`
                        ${config.thumb}
                        absolute top-0.5 left-0.5
                        rounded-full
                        ${thumbClasses[theme]}
                        shadow-soft
                        transition-all duration-300 ease-out
                        ${config.translate}
                    `}
                />
            </div>
            {label && (
                <span className={`text-xs font-medium ${labelClasses[theme]}`}>
                    {label}
                </span>
            )}
        </label>
    );
};

export default SoftToggle;
