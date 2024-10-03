import type {Config} from 'tailwindcss';
import {fontFamily} from 'tailwindcss/defaultTheme';
import {colors} from './data/config/colors';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend:
            {
                keyframes: {
                    'custom-slide-in': {
                        '0%': { transform: 'translateX(100%)', opacity: 0 },
                        '100%': { transform: 'translateX(0)', opacity: 1 },
                    },
                    'custom-slide-out': {
                        '0%': { transform: 'translateX(0)', opacity: 1 },
                        '100%': { transform: 'translateX(100%)', opacity: 0 },
                    },
                },
                animation: {
                    'custom-slide-in': 'custom-slide-in 0.9s ease-out', // Customize the timing and easing
                    'custom-slide-out': 'custom-slide-out 0.9s ease-in', // Customize the timing and easing
                },
                fontFamily: {
                    sans: ['var(--font-space-default)', ...fontFamily.sans],
                    display: ['var(--font-space-display)', ...fontFamily.sans],
                },
                width: {
                    '7xl': '80rem',
                },
                spacing: {
                    '7xl': '80rem',
                },
                colors: {
                    primary: {
                        100: colors.primary.lighter,
                        200: colors.primary.lighter,
                        300: colors.primary.light,
                        400: colors.primary.light,
                        500: colors.primary.main,
                        600: colors.primary.main,
                        700: colors.primary.dark,
                        800: colors.primary.dark,
                        900: colors.primary.darker,
                    },
                    secondary: {
                        100: colors.secondary.lighter,
                        200: colors.secondary.lighter,
                        300: colors.secondary.light,
                        400: colors.secondary.light,
                        500: colors.secondary.main,
                        600: colors.secondary.main,
                        700: colors.secondary.dark,
                        800: colors.secondary.dark,
                        900: colors.secondary.darker,
                    },
                    border: 'hsl(var(--border))',
                    input: 'hsl(var(--input))',
                    ring: colors.primary.dark,
                    background: 'hsl(var(--background))',
                    foreground: 'hsl(var(--foreground))',
                    destructive: {
                        DEFAULT: 'hsl(var(--destructive))',
                        foreground: 'hsl(var(--destructive-foreground))',
                    },
                    muted: {
                        DEFAULT: 'hsl(var(--muted))',
                        foreground: 'hsl(var(--muted-foreground))',
                    },
                    accent: {
                        DEFAULT: 'hsl(var(--accent))',
                        foreground: 'hsl(var(--accent-foreground))',
                    },
                    popover: {
                        DEFAULT: 'hsl(var(--popover))',
                        foreground: 'hsl(var(--popover-foreground))',
                    },
                    card: {
                        DEFAULT: 'hsl(var(--card))',
                        foreground: 'hsl(var(--card-foreground))',
                    },
                },

                screens: {
                    '2xl': '1400px',
                },

                backgroundImage: {
                    'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                    'gradient-conic':
                        'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                },
            },
    },

    plugins: [
        require('tailwindcss-animate'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
export default config;
