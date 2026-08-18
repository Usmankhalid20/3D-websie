import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tissot PRX Powermatic 80 — Swiss Precision, Engineered for Modern Life',
  description:
    'Discover the Tissot PRX Powermatic 80 — a masterpiece of Swiss horology combining an integrated bracelet, architectural case, and the Powermatic 80 automatic movement with 80-hour power reserve.',
  keywords: 'Tissot PRX, Powermatic 80, Swiss watch, automatic movement, luxury watch',
  openGraph: {
    title: 'Tissot PRX Powermatic 80',
    description: 'Precision, reimagined. Swiss craftsmanship integrated into an icon of modern watch design.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
