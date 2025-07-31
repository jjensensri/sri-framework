import '@styles/globals.scss';
import './globals.css'; // get rid of this after removing tailwind

import { CartProvider } from '@components/cart/cart-context';
import { Poppins, Source_Sans_3 } from 'next/font/google';
// import { getCart } from '@lib/shopify';
import { getCart } from '@lib/cart-api';
import { ReactNode } from 'react';

import { baseUrl } from '@lib/utils';
import { Header } from '@components/layout/header';
import { Footer } from '@components/layout/footer/index';

const { SITE_NAME } = process.env;

// Font
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
const sourceSans3 = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
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
    <html lang="en" className={`${poppins.variable} ${sourceSans3.variable}`}>
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
