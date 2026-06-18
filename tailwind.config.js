/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep "servers at night" base
        void: {
          900: '#05070b',
          800: '#070b10',
          700: '#0b1118',
          600: '#0f1722',
        },
        // Signal = alive / up
        signal: {
          50: '#ecfdf5',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        beam: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        // Restrained secondary accent
        pulseviolet: '#8b5cf6',
        ink: {
          100: '#e6edf3',
          300: '#aab6c6',
          500: '#7d8da1',
          600: '#5b6a7d',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glass: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 0 0 1px rgba(255,255,255,0.04)',
        glow: '0 0 40px -8px rgba(16,185,129,0.45)',
        beam: '0 0 60px -10px rgba(34,211,238,0.45)',
      },
      backgroundImage: {
        'signal-gradient': 'linear-gradient(135deg, #10b981 0%, #22d3ee 100%)',
        'grid-faint':
          'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.6)', opacity: '0.6' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        ripple: 'ripple 2.6s ease-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
}
