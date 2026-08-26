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
        foreground: 'var(--foreground)',
        background: 'var(--background)',
        'gray-100': 'var(--color-gray-100)',
        'gray-200': 'var(--color-gray-200)',
        'gray-300': 'var(--color-gray-300)',
        'gray-500': 'var(--color-gray-500)',
        'gray-600': 'var(--color-gray-600)',
        'gray-700': 'var(--color-gray-700)',
        'gray-800': 'var(--color-gray-800)',
        'gray-900': 'var(--color-gray-900)',
        'gray-1000': 'var(--color-gray-1000)',
        'blue-100': 'var(--color-blue-100)',
        'blue-200': 'var(--color-blue-200)',
        'blue-600': 'var(--color-blue-600)',
        'blue-700': 'var(--color-blue-700)',
        'blue-900': 'var(--color-blue-900)',
        'blue-1000': 'var(--color-blue-1000)',
        'red-600': 'var(--color-red-600)',
        'red-700': 'var(--color-red-700)',
        'red-900': 'var(--color-red-900)',
        'green-600': 'var(--color-green-600)',
        'green-700': 'var(--color-green-700)',
        'green-900': 'var(--color-green-900)',
        'amber-600': 'var(--color-amber-600)',
        'amber-700': 'var(--color-amber-700)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'PingFang SC', 'Microsoft YaHei', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      fontSize: {
        'features-title': ['100px', { lineHeight: '1', fontWeight: '900' }],
        'feature-card-title': ['18px', { lineHeight: '1.25', fontWeight: '600' }],
        'feature-card-desc': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
      boxShadow: {
        'custom': '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
