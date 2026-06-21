/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#E2FF3B',
                accent: '#00F0FF',
                surface: '#121212',
                'bg-dark': '#0A0A0A',
                'text-muted': '#888888',
            },
            fontFamily: {
                sans: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
