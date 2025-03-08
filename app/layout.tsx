import '@/styles/globals.css';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { Providers } from '@/app/providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container prose mx-auto max-w-7xl px-6 flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
