import type { Metadata, Viewport } from 'next';
import './globals.css';
import MusicPlayer from '@/components/MusicPlayer';

export const metadata: Metadata = {
  title: 'Our Love Story',
  description: 'Cerita kita dari awal sampai sekarang',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col relative">
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-primary-container/20 blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-tertiary-container/30 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-secondary-fixed-dim/20 blur-3xl" />
        </div>
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}
