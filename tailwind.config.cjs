/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        "theme": "#16161a",
        "theme-nav": "#131316",
        "theme-song": "#222228",
        "accent-light": "#D46FE8",
        "accent-dark": "#9843E7",
      }
    },
  },
  plugins: [],
}

