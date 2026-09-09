import type { Metadata } from 'next';
import './globals.css';
const HERO_IMAGE = '/images/hero-motocross-graphics-kit.jpg';
const HERO_ALT =
  'Custom motocross graphics kit in black and volt yellow — a precision-cut Apex Wrap Lab vinyl wrap on an enduro dirt bike in the workshop';
const DESCRIPTION =
  'Precision-cut wrap kits for ATV, enduro, street bikes and snowboard. Explore the collection and find your next livery. Designed in Cluj-Napoca, Romania.';
export const metadata: Metadata = {
  metadataBase: new URL('https://apexwraplab.com'),
  title: 'Apex Wrap Lab — Make your mark.',
  description: DESCRIPTION,
  keywords: [
    'motocross graphics kit',
    'dirt bike graphics',
    'enduro graphics kit',
    'custom vinyl wrap',
    'motorcycle wrap',
    'ATV graphics kit',
    'snowboard wrap',
    'precision-cut wrap kit',
    'Cluj-Napoca',
    'Romania',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Apex Wrap Lab',
    title: 'Apex Wrap Lab — Make your mark.',
    description: DESCRIPTION,
    url: '/',
    images: [{ url: HERO_IMAGE, width: 2400, height: 1023, alt: HERO_ALT }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apex Wrap Lab — Make your mark.',
    description: DESCRIPTION,
    images: [{ url: HERO_IMAGE, alt: HERO_ALT }],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Barlow:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
