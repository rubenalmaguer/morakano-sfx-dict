/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,svelte}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark", "valentine"],
  },
  plugins: [require("daisyui")],
}

