'use client';

import * as React from 'react';
import { ChevronDown, Check, Search, Globe } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

// Common African country codes
const countryCodes = [
    { code: '+237', country: 'CM', name: 'Cameroun', flag: '🇨🇲' },
    { code: '+234', country: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+225', country: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
    { code: '+221', country: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    { code: '+33', country: 'FR', name: 'France', flag: '🇫🇷' },
    { code: '+1', country: 'US', name: 'États-Unis', flag: '🇺🇸' },
    { code: '+44', country: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
    { code: '+32', country: 'BE', name: 'Belgique', flag: '🇧🇪' },
    { code: '+41', country: 'CH', name: 'Suisse', flag: '🇨🇭' },
    { code: '+49', country: 'DE', name: 'Allemagne', flag: '🇩🇪' },
    { code: '+212', country: 'MA', name: 'Maroc', flag: '🇲🇦' },
    { code: '+216', country: 'TN', name: 'Tunisie', flag: '🇹🇳' },
    { code: '+27', country: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦' },
    { code: '+254', country: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: '+256', country: 'UG', name: 'Ouganda', flag: '🇺🇬' },
    { code: '+255', country: 'TZ', name: 'Tanzanie', flag: '🇹🇿' },
];

export interface PhoneInputProps {
    value?: string;
    onChange?: (value: string) => void;
    defaultCountryCode?: string;
    label?: string;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({
        value = '',
        onChange,
        defaultCountryCode = '+237',
        label,
        error,
        placeholder = '6XX XXX XXX',
        disabled,
        required,
        className,
    }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [search, setSearch] = React.useState('');
        // countryCodes[0] is always defined since the array is constant
        const defaultCountry = countryCodes.find(c => c.code === defaultCountryCode) ?? countryCodes[0]!;
        const [selectedCountry, setSelectedCountry] = React.useState(defaultCountry);
        const [phoneNumber, setPhoneNumber] = React.useState('');
        const containerRef = React.useRef<HTMLDivElement>(null);

        React.useEffect(() => {
            // Parse value if it includes country code
            if (value) {
                const country = countryCodes.find(c => value.startsWith(c.code));
                if (country) {
                    setSelectedCountry(country);
                    setPhoneNumber(value.slice(country.code.length).trim());
                } else {
                    setPhoneNumber(value);
                }
            }
        }, [value]);

        React.useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newNumber = e.target.value.replace(/[^0-9\s]/g, '');
            setPhoneNumber(newNumber);
            onChange?.(`${selectedCountry.code} ${newNumber}`);
        };

        const handleCountrySelect = (country: typeof countryCodes[0]) => {
            setSelectedCountry(country);
            setIsOpen(false);
            setSearch('');
            onChange?.(`${country.code} ${phoneNumber}`);
        };

        const filteredCountries = countryCodes.filter(
            (country) =>
                country.name.toLowerCase().includes(search.toLowerCase()) ||
                country.code.includes(search) ||
                country.country.toLowerCase().includes(search.toLowerCase())
        );

        return (
            <div ref={containerRef} className={cn('space-y-2', className)}>
                {label && (
                    <label className="text-sm font-medium leading-none">
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}
                <div className="relative flex">
                    {/* Country code selector */}
                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        disabled={disabled}
                        className={cn(
                            'flex items-center gap-1 px-3 py-2 border border-r-0 rounded-l-lg bg-muted/50 text-sm',
                            'hover:bg-muted transition-colors',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            disabled && 'opacity-50 cursor-not-allowed',
                            error && 'border-destructive'
                        )}
                    >
                        <span className="text-base">{selectedCountry.flag}</span>
                        <span className="font-medium">{selectedCountry.code}</span>
                        <ChevronDown className={cn(
                            'h-4 w-4 transition-transform',
                            isOpen && 'rotate-180'
                        )} />
                    </button>

                    {/* Phone number input */}
                    <input
                        ref={ref}
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={cn(
                            'flex-1 h-10 px-3 py-2 border rounded-r-lg bg-background text-sm',
                            'placeholder:text-muted-foreground',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            error && 'border-destructive'
                        )}
                    />

                    {/* Country dropdown */}
                    {isOpen && (
                        <div className="absolute left-0 top-full mt-1 w-72 max-h-64 overflow-auto rounded-md border bg-popover shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
                            {/* Search */}
                            <div className="p-2 border-b sticky top-0 bg-popover">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Rechercher un pays..."
                                        className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>
                            {/* Country list */}
                            <ul className="p-1">
                                {filteredCountries.map((country) => (
                                    <li
                                        key={country.code}
                                        onClick={() => handleCountrySelect(country)}
                                        className={cn(
                                            'flex items-center gap-3 px-2 py-1.5 text-sm cursor-pointer rounded-sm',
                                            'hover:bg-accent hover:text-accent-foreground',
                                            selectedCountry.code === country.code && 'bg-accent'
                                        )}
                                    >
                                        <span className="text-lg">{country.flag}</span>
                                        <span className="flex-1">{country.name}</span>
                                        <span className="text-muted-foreground">{country.code}</span>
                                        {selectedCountry.code === country.code && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </li>
                                ))}
                                {filteredCountries.length === 0 && (
                                    <li className="px-2 py-4 text-sm text-muted-foreground text-center">
                                        Aucun pays trouvé
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
            </div>
        );
    }
);
PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
