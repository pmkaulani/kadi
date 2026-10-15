import type { Metadata, Viewport } from 'next';
import { Great_Vibes, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kadi — Invitations, with feeling',
  description:
    'Thoughtfully designed digital invitations with tactile envelope openings, cinematic photography and simple guest replies.',
  keywords: [
    'digital invitation',
    'Kenya wedding invitation',
    'animated envelope',
    'RSVP tracker',
    'M-Pesa wedding contribution',
    'Kenya events',
  ],
  authors: [{ name: 'Kadi Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#F6F2EA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${greatVibes.variable}`}>
      <body className="font-sans min-h-screen bg-brand-mist text-brand-charcoal antialiased flex flex-col selection:bg-brand-purple selection:text-white">
        {children}
      </body>
    </html>
  );
}
