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
        /* Kadi is editorial stationery, not a SaaS dashboard. These semantic names
           are retained for compatibility while their values establish the new palette. */
        brand: {
          purple: '#934638',
          'purple-hover': '#73352B',
          'purple-light': '#F1E3DB',
          gold: '#B99A62',
          'gold-light': '#F4EDDF',
          charcoal: '#272620',
          slate: '#756F64',
          mist: '#F6F2EA',
        },
        event: {
          rose: '#A94F51',
          'rose-light': '#F4E7E3',
          coral: '#BE5A42',
          'coral-light': '#F7E7DE',
          sage: '#747D62',
          'sage-light': '#E9EBDD',
          gold: '#B99A62',
        },
        status: {
          success: '#42674D',
          warning: '#93682D',
          error: '#A23931',
          info: '#46687A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        script: ['var(--font-great-vibes)', 'cursive'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'envelope-closed': '0 30px 70px -28px rgba(28, 27, 22, 0.55), 0 10px 24px -14px rgba(28, 27, 22, 0.28)',
        'envelope-flap': '0 18px 36px -8px rgba(0, 0, 0, 0.28)',
        'card-depth': '0 32px 70px -24px rgba(28, 27, 22, 0.40), 0 0 0 1px rgba(28, 27, 22, 0.06)',
        'seal-emboss': '0 5px 12px rgba(28, 27, 22, 0.24), inset 0 2px 3px rgba(255, 255, 255, 0.34)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slow-drift': 'slow-drift 14s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
