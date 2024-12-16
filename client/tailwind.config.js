const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        'arial': ['Arial', 'sans-serif'],
        'verdana': ['Verdana', 'sans-serif'],
        'georgia': ['Georgia', 'serif'],
        'times-new-roman': ['Times New Roman', 'serif'],
        'courier-new': ['Courier New', 'monospace'],
        'impact': ['Impact', 'sans-serif'],
        'helvetica': ['Helvetica', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
        'playfair-display': ['Playfair Display', 'serif'],
        'merriweather': ['Merriweather', 'serif'],
        'oswald': ['Oswald', 'sans-serif'],
        'pt-sans': ['PT Sans', 'sans-serif'],
        'work-sans': ['Work Sans', 'sans-serif'],
        'ubuntu': ['Ubuntu', 'sans-serif'],
        'source-sans-pro': ['Source Sans Pro', 'sans-serif'],
        'quicksand': ['Quicksand', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'cabin': ['Cabin', 'sans-serif'],
        'fira-sans': ['Fira Sans', 'sans-serif'],
        'rubik': ['Rubik', 'sans-serif'],
        'karla': ['Karla', 'sans-serif']
      }
    },
  },
  plugins: [flowbite.plugin()],
};
