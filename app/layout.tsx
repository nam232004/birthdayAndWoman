import '../styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Women\'s Day & Birthday Celebration',
    description: 'A special celebration page for Women\'s Day and Birthday',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="overflow-x-hidden">
                {children}
            </body>
        </html>
    );
} 