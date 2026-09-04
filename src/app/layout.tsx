import type { Metadata } from 'next';
import { Instrument_Serif, Cormorant_Garamond, Manrope, Great_Vibes } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument',
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'The Story of Us',
  description: 'A journey through the memories that made us.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='antialiased dark'>
      <body
        className={clsx(
          greatVibes.variable,
          instrumentSerif.variable,
          cormorantGaramond.variable,
          manrope.variable,
          'font-sans bg-obsidian text-soft-ivory overflow-x-hidden'
        )}
      >
        {children}
      </body>
    </html>
  );
}
