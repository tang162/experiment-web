import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#409eff',
        success: '#67c23a',
        warning: '#e6a23c',
        danger: '#f56c6c',
        info: '#909399',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
} satisfies Config