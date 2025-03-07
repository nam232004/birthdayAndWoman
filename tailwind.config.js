/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'love-red': '#FF1744',
                'love-pink': '#FF4081',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'fall': 'fall 10s linear infinite',
                'sparkle': 'sparkle 1s infinite ease-in-out',
                'glow-pulse': 'glow-pulse 2s infinite ease-in-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fall: {
                    '0%': { transform: 'translateY(-100%) rotate(0deg)' },
                    '100%': { transform: 'translateY(100vh) rotate(360deg)' },
                },
                sparkle: {
                    '0%, 100%': { opacity: 0, transform: 'scale(0)' },
                    '50%': { opacity: 1, transform: 'scale(1)' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: 0.5, filter: 'brightness(1)' },
                    '50%': { opacity: 1, filter: 'brightness(1.2)' },
                },
            },
            boxShadow: {
                'cake': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                'glow': '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3), 0 0 45px rgba(255, 255, 255, 0.1)',
            },
        },
    },
    plugins: [],
} 