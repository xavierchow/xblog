import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/theme';

export default {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/components/button.js',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                white: '#D9D9D9',
                black: '#0E0E0E',
                cyan: '#6FE2FF',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        nextui({
            addCommonColors: true,
        }),
    ],
} satisfies Config;
