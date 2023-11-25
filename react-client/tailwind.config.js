/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,css}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#14b8a6",
          "secondary": "#eab308",
          "accent": "#e11d48",
          "neutral": "#f3f4f6",
          "base-100": "#1b1b1c",
          "info": "#ffffff",
          "success": "#4ade80",
          "warning": "#b91c1c",
          "error": "#292524",
        }
      }
    ]
  },
  theme: {
    fontFamily: {
      'Lato': ['Lato', 'sans-serif']
    },
    extend: {
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('daisyui'),
    // eslint-disable-next-line no-undef
    require('@codaworks/react-glow/tailwind'),
  ],
}