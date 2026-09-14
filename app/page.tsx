'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CounterSection from '@/components/CounterSection';
import QuickNavSection from '@/components/QuickNavSection';
import ThrowbackMemory from '@/components/ThrowbackMemory';
import MusicPlayer from '@/components/MusicPlayer';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import type { Settings } from '@/lib/data';

export default function HomePage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
      } else {
        setSettings(data);
      }
      setLoading(false);
    }

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="w-full pt-20 flex-1 relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            {/* Loading spinner rapi */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-primary-container/30" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            </div>
            <p className="text-sm text-on-surface-variant">
              Memuat kenangan kita... 💕
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!settings) {
    return (
      <>
        <Navbar />
        <main className="w-full pt-20 flex-1 relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 56 }}>
              error
            </span>
            <h2 className="font-serif text-2xl text-on-surface">Data belum tersedia</h2>
            <p className="text-sm text-on-surface-variant max-w-md">
              Pastikan tabel <code>settings</code> sudah ada di Supabase.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="w-full pt-20 flex-1 relative z-10">
        <div className="flex flex-col w-full">
          <div className="relative w-full overflow-hidden px-gutter lg:px-margin pb-20 pt-8">
            <div className="absolute -top-12 left-1/3 w-80 h-80 rounded-full bg-primary-container/20 blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/2 -left-10 w-96 h-96 rounded-full bg-tertiary-container/25 blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-secondary-fixed-dim/20 blur-3xl pointer-events-none -z-10" />

            <HeroSection
              coupleNames={settings.couple_names}
              badgeText={settings.badge_text}
              bio={settings.bio}
              photoUrl={settings.hero_photo_url}
              photoDate={settings.hero_photo_date}
              photoCaption={settings.hero_photo_caption}
              photoSubtitle={settings.hero_photo_subtitle}
              startDate={settings.start_date}
            />

            <CounterSection startDate={settings.start_date} />

            <QuickNavSection />

            <ThrowbackMemory />
          </div>
        </div>
      </main>

      <MusicPlayer />
      <Footer coupleNames={settings.couple_names} startDate={settings.start_date} />
    </>
  );
}
