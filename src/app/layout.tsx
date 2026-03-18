import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from '@/components/ui/provider';
import './globals.css';
import Script from 'next/script';
import { PageViewTracker } from '@/components/pageviewtracker/PageViewTracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "ЦКД 'ПАРУС' | Центр культуры и досуга",
  description:
    "Официальный сайт Центра культуры и досуга 'Парус' города Советск",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://culturaltracking.ru/static/js/spxl.js?pixelId=34857"
          data-pixel-id="34857"
        />
      </head>
      <body>
        <Provider>
          {children}
          <PageViewTracker />
        </Provider>
      </body>
    </html>
  );
}
