import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
import './globals.css';

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const serif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'GirlfriendGPT',
  description: 'Private, one-on-one AI companion chat for adults. Meet sixty-eight fictional companions for the hours after midnight.',
  keywords: ['AI companion', 'chat', 'roleplay', 'NSFW', 'virtual girlfriend', 'AI girlfriend'],
  authors: [{ name: 'GirlfriendGPT' }],
  creator: 'GirlfriendGPT',
  publisher: 'GirlfriendGPT',
  robots: 'noindex, nofollow', // Private adult content
  openGraph: {
    title: 'GirlfriendGPT',
    description: 'Private companions for the hours after midnight.',
    type: 'website',
    locale: 'en_US',
    siteName: 'GirlfriendGPT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GirlfriendGPT',
    description: 'Private, one-on-one AI companion chat for adults.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#12100f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} data-type="software" data-site-kind="tech">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://openrouter.ai" />
      </head>
      <body className="bg-ink-1 text-paper-1 antialiased">
        {children}
      </body>
    </html>
  );
}