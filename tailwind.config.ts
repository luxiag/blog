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
        // 项目主题颜色
        foreground: 'var(--foreground)',
        background: 'var(--background)',
        'orange-800': 'var(--color-orange-800)',
        'neutral-100': 'var(--color-neutral-100)',
        'neutral-200': 'var(--color-neutral-200)',
        'neutral-300': 'var(--color-neutral-300)',
        'neutral-400': 'var(--color-neutral-400)',
        'neutral-500': 'var(--color-neutral-500)',
        'neutral-950': 'var(--color-neutral-950)',
        'border-color': 'var(--border-color)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        serif: ['var(--font-serif)', 'Georgia', '"Times New Roman"', 'serif'],
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
        DEFAULT: '8px',
      },
      boxShadow: {
        'custom': '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
