import type { Config } from 'tailwindcss'
import { colors } from './tailwind.colors'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    colors,
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      serif: ['"Source Serif 4"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif']
    },
    screens: {
      900: '900px',
      1080: '1080px',
      1250: '1250px',
      1440: '1440px'
    },
    extend: {}
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ]
} satisfies Config
