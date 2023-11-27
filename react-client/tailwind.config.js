/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,css}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#610C9F",
          "secondary": "#b91c1c",
          "accent": "#34d399",
          "neutral": "#f3f4f6",
          "base-100": "#1b1b1c",
          "info": "#f3effe",
          "success": "#4ade80",
          "warning": "#92400e",
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