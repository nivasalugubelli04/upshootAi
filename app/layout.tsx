import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Upshoot AI — Content, Ads & Marketing That Converts',
  description:
    'Upshoot AI is a lean content-and-performance team that helps brands capture attention, create campaigns that convert, and inspire loyalty. From Meta Ads to full paid media, we build what your growth stage needs.',
  keywords: [
    'digital marketing',
    'Meta Ads',
    'Google Ads',
    'YouTube Ads',
    'email marketing',
    'content creation',
    'brand optimisation',
    'paid media strategy',
    'web design',
  ],
  openGraph: {
    title: 'Upshoot AI — Content, Ads & Marketing That Converts',
    description:
      'Fast content, full-funnel ads, or full white-glove marketing — built around your brand.',
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
        <meta name="theme-color" content="#0f0f11" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
