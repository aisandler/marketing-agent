import React from 'react';
import type { SoftTheme } from './SoftCard';

export interface PillButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    theme?: SoftTheme;
    className?: string;
}

const sizeClasses = {
    sm: 'px-3 py-1.5 text-[10px] gap-1.5',
    md: 'px-4 py-2 text-xs gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2',
};

const variantClasses = {
    dark: {
        primary: `
            bg-soft-indigo-500 text-white
            hover:bg-soft-indigo-400
            active:bg-soft-indigo-600
        `,
        secondary: `
            bg-soft-dark-300 text-slate-200
            hover:bg-soft-dark-400 hover:text-white
            active:bg-soft-dark-200
        `,
        ghost: `
            bg-transparent text-slate-300
            hover:bg-soft-dark-300 hover:text-white
            active:bg-soft-dark-200
        `,
    },
    light: {
        primary: `
            bg-soft-indigo-500 text-white
            hover:bg-soft-indigo-400
            active:bg-soft-indigo-600
        `,
        secondary: `
            bg-soft-light-300 text-slate-700
            hover:bg-soft-light-400 hover:text-slate-900
            active:bg-soft-light-200
        `,
        ghost: `
            bg-transparent text-slate-600
            hover:bg-soft-light-300 hover:text-slate-800
            active:bg-soft-light-200
        `,
    },
};

const activeClasses = {
    dark: 'ring-2 ring-soft-indigo-400/40 shadow-soft-glow',
    light: 'ring-2 ring-soft-indigo-400/30 shadow-soft-glow-light',
};

/**
 * A pill-shaped button with multiple variants.
 *
 * @param variant - Visual style: 'primary' (indigo), 'secondary' (subtle), or 'ghost' (transparent)
 * @param size - Button size: 'sm', 'md', or 'lg'
 * @param icon - Optional icon element to display before children
 * @param active - Whether button is in active/selected state
 * @param theme - Color scheme: 'dark' (default) or 'light'
 */
const PillButton: React.FC<PillButtonProps> = ({
    children,
    onClick,
    variant = 'secondary',
    size = 'md',
    icon,
    active = false,
    disabled = false,
    theme = 'dark',
    className = '',
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center
                rounded-full
                font-medium
                transition-all duration-200 ease-out
                ${sizeClasses[size]}
                ${variantClasses[theme][variant]}
                ${active ? activeClasses[theme] : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `.trim().replace(/\s+/g, ' ')}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
};

export default PillButton;
