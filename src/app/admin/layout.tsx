import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin - Bistro Saimaa',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi" className={GeistSans.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
