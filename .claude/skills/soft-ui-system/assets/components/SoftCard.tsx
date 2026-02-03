import React from 'react';

export type SoftTheme = 'dark' | 'light';

export interface SoftCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    theme?: SoftTheme;
    id?: string;
}

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
};

const variantClasses = {
    dark: {
        default: 'bg-soft-dark-200 border border-white/[0.06]',
        elevated: 'bg-soft-dark-200 border border-white/[0.08] shadow-soft',
        glass: 'bg-soft-dark-200/80 backdrop-blur-md border border-white/[0.06]',
    },
    light: {
        default: 'bg-white border border-slate-200/60',
        elevated: 'bg-white border border-slate-200/60 shadow-soft-light',
        glass: 'bg-white/80 backdrop-blur-md border border-slate-200/40',
    },
};

/**
 * A soft, rounded container component with multiple variants.
 *
 * @param variant - Visual style: 'default', 'elevated' (with shadow), or 'glass' (frosted)
 * @param padding - Internal padding: 'none', 'sm', 'md', or 'lg'
 * @param theme - Color scheme: 'dark' (default) or 'light'
 */
const SoftCard: React.FC<SoftCardProps> = ({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    theme = 'dark',
    id,
}) => {
    return (
        <div
            id={id}
            className={`
                rounded-soft-lg
                ${variantClasses[theme][variant]}
                ${paddingClasses[padding]}
                ${className}
            `.trim().replace(/\s+/g, ' ')}
        >
            {children}
        </div>
    );
};

export default SoftCard;
