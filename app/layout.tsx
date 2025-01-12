import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import NavBar from '@/app/components/nav_bar';
const gaId = process.env.GA_ID || '';
const aeonik = localFont({
  src: [
    {
      path: './fonts/AeonikTRIAL-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/AeonikTRIAL-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/AeonikTRIAL-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/AeonikTRIAL-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-aeonik',
});

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
      <body className={`${aeonik.className} antialiased h-full`}>
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
