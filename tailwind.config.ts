import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'foreground': 'oklch(0.145 0 0)',
        'background': '#f5f5f5',
        'orange-800': '#ea580c',
        'neutral-100': '#f5f5f5',
        'neutral-200': 'oklch(0.145 0 0)',
        'neutral-300': 'oklch(0.145 0 0)',
        'neutral-400': 'oklch(0.145 0 0)',
        'neutral-500': 'oklch(0.145 0 0)',
        'neutral-950': 'oklch(0.145 0 0)',
        'border-color': 'oklch(0.145 0 0)',
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontSize: {
        'features-title': ['100px', { lineHeight: '1', fontWeight: '900' }],
        'feature-card-title': ['18px', { lineHeight: '1.25', fontWeight: '600' }],
        'feature-card-desc': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
      }
    },
  },
  plugins: [],
};
export default config;