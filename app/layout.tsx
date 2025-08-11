import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from './ConvexClientProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sugary.dev'),
  title: {
    default: 'Build What Matters | Sugary',
    template: '%s | Sugary',
  },
  description:
    'Turn feature requests into engaged waitlists. Track interest, keep users updated, and build what matters most.',
  keywords: [
    'feature requests',
    'product feedback',
    'user engagement',
    'waitlist',
    'product management',
    'startup tools',
    'customer feedback',
  ],
  authors: [{ name: 'Sugary' }],
  creator: 'Sugary',
  publisher: 'Sugary',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sugary.dev',
    siteName: 'Sugary',
    title: 'Build What Matters | Sugary',
    description:
      'Turn feature requests into engaged waitlists. Track interest, keep users updated, and build what matters most.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sugary - Build What Matters',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build What Matters | Sugary',
    description:
      'Turn feature requests into engaged waitlists. Track interest, keep users updated, and build what matters most.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://sugary.dev',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
