import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Primary: Blue (trust, professionalism)
                primary: {
                    DEFAULT: '#2563EB',
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                    950: '#172554',
                },
                // Secondary: Orange (energy, action, Africa inspired)
                secondary: {
                    DEFAULT: '#F97316',
                    50: '#FFF7ED',
                    100: '#FFEDD5',
                    200: '#FED7AA',
                    300: '#FDBA74',
                    400: '#FB923C',
                    500: '#F97316',
                    600: '#EA580C',
                    700: '#C2410C',
                    800: '#9A3412',
                    900: '#7C2D12',
                    950: '#431407',
                },
                // Semantic colors
                success: {
                    DEFAULT: '#10B981',
                    50: '#ECFDF5',
                    100: '#D1FAE5',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                },
                error: {
                    DEFAULT: '#EF4444',
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                },
                // Background variants
                background: {
                    DEFAULT: 'hsl(var(--background))',
                    secondary: 'hsl(var(--background-secondary))',
                },
                foreground: {
                    DEFAULT: 'hsl(var(--foreground))',
                    muted: 'hsl(var(--foreground-muted))',
                },
                border: 'hsl(var(--border))',
                ring: 'hsl(var(--ring))',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'glow': '0 0 15px rgba(37, 99, 235, 0.3)',
                'glow-secondary': '0 0 15px rgba(249, 115, 22, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-in-out',
                'fade-out': 'fadeOut 0.2s ease-in-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'slide-in-left': 'slideInLeft 0.3s ease-out',
                'slide-in-up': 'slideInUp 0.3s ease-out',
                'slide-in-down': 'slideInDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-soft': 'pulseSoft 2s infinite',
                'shimmer': 'shimmer 2s infinite',
                'progress-indeterminate': 'progressIndeterminate 1.5s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInDown: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                progressIndeterminate: {
                    '0%': { transform: 'translateX(-100%)' },
                    '50%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            transitionDuration: {
                '400': '400ms',
            },
            screens: {
                'xs': '475px',
            },
        },
    },
    plugins: [],
};

export default config;
