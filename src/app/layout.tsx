// ============================================================
// app/layout.tsx — Root layout
// ============================================================

import type { Metadata } from 'next';
import { Rajdhani, Barlow_Condensed } from 'next/font/google';
import './globals.css';

// Primary UI font — Rajdhani is angular and military, fits VALORANT's tone
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
});

// Display / heading font — Barlow Condensed for impact headings
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-valorant',
});

export const metadata: Metadata = {
  title: 'VALORANT Map Veto — Bo3',
  description: 'Real-time VALORANT map ban/pick system for Best of 3 matches',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${barlowCondensed.variable}`}>
      <body className="font-ui bg-val-darker text-val-text antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
