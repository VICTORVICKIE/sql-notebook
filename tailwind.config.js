/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{html,ts,svelte}'],
    safelist: [
        {
            pattern: /h-*/
        }
    ],
    theme: {
        extend: {}
    },
    plugins: [require('daisyui')]
};
