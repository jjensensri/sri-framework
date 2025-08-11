import '@styles/globals.scss';
import './globals.css'; // get rid of this after removing tailwind

import { CartProvider } from '@components/cart/cart-context';
import { Assistant, Montserrat, Mulish, Poppins, Source_Sans_3 } from 'next/font/google';
// import { getCart } from '@lib/shopify';
import { getCart } from '@lib/cart-api';
import { ReactNode } from 'react';

import { baseUrl } from '@lib/utils';
import { Header } from '@components/layout/header';
import { Footer } from '@components/layout/footer/index';

const { SITE_NAME } = process.env;

// Font
const assistant = Assistant({
  variable: '--font-assistant',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '700'],
});
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
  weight: ['700'],
});

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en" className={`${assistant.variable} ${montserrat.variable}`}>
      <body>
        <CartProvider cartPromise={cart}>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
