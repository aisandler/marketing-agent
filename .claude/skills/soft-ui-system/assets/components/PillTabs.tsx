import React from 'react';
import type { SoftTheme } from './SoftCard';

export interface Tab {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

export interface PillTabsProps {
    tabs: Tab[];
    value: string;
    onChange: (value: string) => void;
    size?: 'sm' | 'md';
    theme?: SoftTheme;
    className?: string;
}

const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-1',
    md: 'text-xs px-3 py-1.5',
};

const containerClasses = {
    dark: 'bg-soft-dark-300',
    light: 'bg-soft-light-300',
};

const tabClasses = {
    dark: {
        active: 'bg-soft-indigo-500/90 text-white shadow-soft',
        inactive: 'text-slate-400 hover:text-slate-200 hover:bg-soft-dark-400/50',
    },
    light: {
        active: 'bg-soft-indigo-500/90 text-white shadow-soft-light',
        inactive: 'text-slate-500 hover:text-slate-700 hover:bg-soft-light-400/50',
    },
};

/**
 * A pill-shaped tab navigation component.
 *
 * @param tabs - Array of tab objects with value, label, and optional icon
 * @param value - Currently selected tab value
 * @param onChange - Callback when tab selection changes
 * @param size - Tab size: 'sm' or 'md'
 * @param theme - Color scheme: 'dark' (default) or 'light'
 */
const PillTabs: React.FC<PillTabsProps> = ({
    tabs,
    value,
    onChange,
    size = 'md',
    theme = 'dark',
    className = '',
}) => {
    return (
        <div
            className={`
                inline-flex items-center
                ${containerClasses[theme]}
                rounded-full
                p-1
                ${className}
            `}
        >
            {tabs.map((tab) => {
                const isActive = tab.value === value;
                return (
                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        className={`
                            inline-flex items-center justify-center gap-1.5
                            rounded-full
                            font-medium
                            transition-all duration-200 ease-out
                            ${sizeClasses[size]}
                            ${isActive
                                ? tabClasses[theme].active
                                : tabClasses[theme].inactive
                            }
                        `}
                    >
                        {tab.icon && (
                            <span className="flex-shrink-0">{tab.icon}</span>
                        )}
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default PillTabs;
