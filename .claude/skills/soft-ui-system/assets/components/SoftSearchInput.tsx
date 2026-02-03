import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { SoftTheme } from './SoftCard';

// Default icons - can be overridden via props
const DefaultSearchIcon: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
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
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const DefaultXIcon: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
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
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const DefaultCommandIcon: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
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
        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
    </svg>
);

export interface SoftSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    showShortcut?: boolean;
    shortcutKey?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    autoFocus?: boolean;
    searchIcon?: React.ReactNode;
    clearIcon?: React.ReactNode;
    commandIcon?: React.ReactNode;
    theme?: SoftTheme;
    className?: string;
}

const containerClasses = {
    dark: {
        base: 'bg-soft-dark-200 border-white/[0.06]',
        hover: 'hover:border-white/[0.1]',
        focus: 'border-soft-indigo-500/50 ring-2 ring-soft-indigo-500/20',
    },
    light: {
        base: 'bg-white border-slate-200/60',
        hover: 'hover:border-slate-300/80',
        focus: 'border-soft-indigo-400/50 ring-2 ring-soft-indigo-400/15',
    },
};

const iconClasses = {
    dark: {
        default: 'text-slate-500',
        focus: 'text-soft-indigo-400',
    },
    light: {
        default: 'text-slate-400',
        focus: 'text-soft-indigo-500',
    },
};

const inputClasses = {
    dark: 'text-slate-300 placeholder:text-slate-500',
    light: 'text-slate-700 placeholder:text-slate-400',
};

const clearButtonClasses = {
    dark: 'text-slate-500 hover:text-slate-300 hover:bg-soft-dark-400',
    light: 'text-slate-400 hover:text-slate-600 hover:bg-soft-light-300',
};

const shortcutClasses = {
    dark: 'bg-soft-dark-300 text-slate-500',
    light: 'bg-soft-light-300 text-slate-500',
};

/**
 * A soft search input with debounced onChange and optional keyboard shortcut.
 *
 * @param value - Current search value
 * @param onChange - Debounced callback when value changes
 * @param placeholder - Placeholder text
 * @param debounceMs - Debounce delay in ms (default: 300)
 * @param showShortcut - Whether to show keyboard shortcut hint
 * @param shortcutKey - Key for shortcut (default: 'K')
 * @param searchIcon - Custom search icon
 * @param clearIcon - Custom clear (X) icon
 * @param commandIcon - Custom command key icon
 * @param theme - Color scheme: 'dark' (default) or 'light'
 */
const SoftSearchInput: React.FC<SoftSearchInputProps> = ({
    value,
    onChange,
    placeholder = 'Search...',
    debounceMs = 300,
    showShortcut = false,
    shortcutKey = 'K',
    onFocus,
    onBlur,
    autoFocus = false,
    searchIcon,
    clearIcon,
    commandIcon,
    theme = 'dark',
    className = '',
}) => {
    const [localValue, setLocalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const styles = containerClasses[theme];
    const icons = iconClasses[theme];

    const SearchIcon = searchIcon || <DefaultSearchIcon size={14} className={isFocused ? icons.focus : icons.default} />;
    const ClearIcon = clearIcon || <DefaultXIcon size={12} />;
    const CommandIcon = commandIcon || <DefaultCommandIcon size={10} />;

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            onChange(newValue);
        }, debounceMs);
    }, [onChange, debounceMs]);

    const handleClear = useCallback(() => {
        setLocalValue('');
        onChange('');
        inputRef.current?.focus();
    }, [onChange]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        onBlur?.();
    }, [onBlur]);

    useEffect(() => {
        if (!showShortcut) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showShortcut, shortcutKey]);

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const hasValue = localValue.length > 0;

    return (
        <div
            className={`
                relative flex items-center gap-2
                ${styles.base}
                border
                rounded-soft-lg
                px-3 py-2
                transition-all duration-200
                ${isFocused ? styles.focus : styles.hover}
                ${className}
            `}
        >
            <span className="flex-shrink-0 transition-colors duration-200">
                {SearchIcon}
            </span>

            <input
                ref={inputRef}
                type="text"
                value={localValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                autoFocus={autoFocus}
                className={`
                    flex-1 min-w-0
                    bg-transparent
                    text-xs
                    ${inputClasses[theme]}
                    outline-none
                `}
            />

            {hasValue && (
                <button
                    onClick={handleClear}
                    className={`
                        flex-shrink-0
                        p-0.5 rounded
                        ${clearButtonClasses[theme]}
                        transition-colors duration-150
                    `}
                    aria-label="Clear search"
                >
                    {ClearIcon}
                </button>
            )}

            {showShortcut && !hasValue && !isFocused && (
                <div className={`
                    flex items-center gap-0.5
                    px-1.5 py-0.5
                    ${shortcutClasses[theme]}
                    rounded
                    text-[10px]
                    flex-shrink-0
                `}>
                    {CommandIcon}
                    <span>{shortcutKey}</span>
                </div>
            )}
        </div>
    );
};

export default SoftSearchInput;
