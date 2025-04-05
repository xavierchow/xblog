import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';

import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import NavBar from '@/app/components/nav_bar';
const gaId = process.env.GA_ID || '';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Xavier's blog posts",
  description: "xavier zhou's blog posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${nunito.className} antialiased h-full`}>
        <NavBar />
        {children}
        <div className="container mt-6 h-12 text-sm md:text-base mx-auto flex flex-row justify-end p-2">
          © 2025 Xavier Zhou
        </div>
      </body>
      <GoogleAnalytics gaId={gaId} />
    </html>
  );
}
