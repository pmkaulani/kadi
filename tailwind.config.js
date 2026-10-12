/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#6B4EFF',
          'purple-hover': '#583BD9',
          'purple-light': '#F0EDFF',
          gold: '#F5B942',
          'gold-light': '#FEF7E6',
          charcoal: '#1A1A2E',
          slate: '#64748B',
          mist: '#F1F5F9',
        },
        event: {
          rose: '#E85D75',
          'rose-light': '#FDF2F4',
          coral: '#FF6B6B',
          'coral-light': '#FFF0F0',
          sage: '#7A8B7A',
          'sage-light': '#F2F5F2',
          gold: '#D4AF37',
        },
        status: {
          success: '#15803D',
          warning: '#92400E',
          error: '#B91C1C',
          info: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        script: ['var(--font-great-vibes)', 'cursive'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'envelope-closed': '0 25px 50px -12px rgba(26, 26, 46, 0.25), 0 10px 20px -5px rgba(26, 26, 46, 0.15)',
        'envelope-flap': '0 15px 30px -5px rgba(0, 0, 0, 0.3)',
        'card-depth': '0 30px 60px -15px rgba(26, 26, 46, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'seal-emboss': '0 4px 8px rgba(0, 0, 0, 0.25), inset 0 2px 3px rgba(255, 255, 255, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
