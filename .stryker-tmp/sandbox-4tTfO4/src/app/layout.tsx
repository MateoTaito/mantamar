// @ts-nocheck
import type { Metadata } from 'next';
import Header from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mantamar',
  description:
    'Mantamar es una tienda de ponchos y prendas de lana chilena, tejidos a mano por artesanas y artesanos del sur de Chile.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Header />
        {children}
      </body>
    </html>
  );
}
