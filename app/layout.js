import { Inter, Righteous, Montserrat } from 'next/font/google';
import { Providers } from './providers';
import '@/styles/global.scss';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const righteous = Righteous({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-righteous',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat',
});

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '';

// Structured data for SEO - static to avoid hydration issues
const website = process.env.NEXT_PUBLIC_WEBSITE || 'http://localhost:3000';
const companyName = process.env.NEXT_PUBLIC_NAME_COMPANY || 'HighLands Marine Supply SA';
const metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION || '';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: companyName,
  url: website,
  description: metaDescription,
  image: `${website}/images/main.webp`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: process.env.NEXT_PUBLIC_ADDRESS_COMPANY || '',
    addressLocality: process.env.NEXT_PUBLIC_CITY_COMPANY || '',
    addressRegion: process.env.NEXT_PUBLIC_STATE_COMPANY || '',
    postalCode: process.env.NEXT_PUBLIC_ZIP_CODE_COMPANY || '',
    addressCountry: 'US',
  },
  telephone: '+1-XXX-XXX-XXXX',
};

export const metadata = {
  title: `${companyName} - Marine Supply Contact Form`,
  description: metaDescription || `Contact form for ${companyName}. Submit your marine supply requests, vessel information, and service inquiries.`,
  metadataBase: new URL(website),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${companyName} - Marine Supply Contact Form`,
    description: metaDescription || `Contact form for ${companyName}. Submit your marine supply requests, vessel information, and service inquiries.`,
    url: website,
    siteName: companyName,
    images: [
      {
        url: `${website}/images/main.webp`,
        width: 800,
        height: 600,
        alt: companyName,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${companyName} - Marine Supply Contact Form`,
    description: metaDescription || `Contact form for ${companyName}. Submit your marine supply requests, vessel information, and service inquiries.`,
    images: [`${website}/images/main.webp`],
  },
};

export const viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${inter.className} ${righteous.variable} ${montserrat.variable}`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}
