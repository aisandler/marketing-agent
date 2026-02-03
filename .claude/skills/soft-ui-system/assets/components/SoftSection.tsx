import React, { useState } from 'react';
import type { SoftTheme } from './SoftCard';

// Default chevron icon - can be overridden via chevronIcon prop
const DefaultChevron: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

export interface SoftSectionProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    chevronIcon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    theme?: SoftTheme;
    className?: string;
}

const titleClasses = {
    dark: 'text-slate-300 group-hover:text-slate-200',
    light: 'text-slate-700 group-hover:text-slate-800',
};

const descriptionClasses = {
    dark: 'text-slate-500',
    light: 'text-slate-500',
};

const chevronClasses = {
    dark: 'text-slate-500',
    light: 'text-slate-400',
};

/**
 * A collapsible section component with animated expand/collapse.
 *
 * @param title - Section header title
 * @param description - Optional subtitle/description
 * @param icon - Optional icon element displayed before title
 * @param chevronIcon - Custom chevron icon (defaults to built-in SVG)
 * @param defaultOpen - Whether section starts expanded
 * @param theme - Color scheme: 'dark' (default) or 'light'
 */
const SoftSection: React.FC<SoftSectionProps> = ({
    title,
    description,
    icon,
    chevronIcon,
    children,
    defaultOpen = true,
    theme = 'dark',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const ChevronElement = chevronIcon || <DefaultChevron size={16} className={chevronClasses[theme]} />;

    return (
        <div className={className}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    w-full flex items-center justify-between
                    py-2
                    text-left
                    group
                "
            >
                <div className="flex items-center gap-2.5">
                    {icon && (
                        <span className="text-soft-indigo-400 flex-shrink-0">
                            {icon}
                        </span>
                    )}
                    <div>
                        <h3 className={`text-xs font-semibold transition-colors ${titleClasses[theme]}`}>
                            {title}
                        </h3>
                        {description && (
                            <p className={`text-[10px] mt-0.5 leading-tight ${descriptionClasses[theme]}`}>
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                <span
                    className={`
                        transition-transform duration-200 ease-out
                        ${isOpen ? 'rotate-180' : ''}
                    `}
                >
                    {ChevronElement}
                </span>
            </button>
            <div
                className={`
                    overflow-hidden
                    transition-all duration-200 ease-out
                    ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                <div className="pt-3 pb-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SoftSection;
