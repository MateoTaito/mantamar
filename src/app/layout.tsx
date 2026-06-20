import type { Metadata } from 'next';
import { Geist, Geist_Mono, Fraunces } from 'next/font/google';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const htmlClass = `h-full antialiased ${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`;

export const metadata: Metadata = {
  title: 'Mantamar',
  description:
    'Mantamar es una casa de oficio chilena: ponchos y prendas de lana chilena tejidas a mano en el sur de Chile.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={htmlClass}>
      <body className="min-h-full flex flex-col bg-charcoal text-sand">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
