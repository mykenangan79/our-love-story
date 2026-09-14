'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import Footer from '@/components/Footer';
import TimelineCard from '@/components/timeline/TimelineCard';
import { supabase } from '@/lib/supabase';
import { memoryToChapter, type Chapter, type MemoryRow } from '@/lib/timeline-data';

const FILTERS = [
  { id: 'all', label: 'Semua Babak' },
  { id: 'kencan', label: 'Kencan' },
  { id: 'liburan', label: 'Liburan' },
  { id: 'milestone', label: 'Milestone Penting' },
];

export default function TimelinePage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchMemories() {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('is_public', true)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching memories:', error);
      } else if (data) {
        const mapped = (data as MemoryRow[]).map((row, i) =>
          memoryToChapter(row, i)
        );
        setChapters(mapped);
      }
      setLoading(false);
    }

    fetchMemories();
  }, []);

  const visible =
    filter === 'all' ? chapters : chapters.filter((c) => c.category === filter);

  return (
    <>
      <Navbar />

      <main className="w-full pt-20 flex-1 relative z-10">
        <div className="w-full px-gutter-sm sm:px-gutter lg:px-margin max-w-7xl mx-auto py-space-xl relative">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-space-xl flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-space-sm shadow-sm">
              <span className="material-symbols-outlined text-[14px]">auto_stories</span>
              <span>Jejak Langkah Berdua</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-primary tracking-tight mb-space-xs">
              Babak Cerita Kita
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Setiap detik, tawa, dan pelukan yang membentuk kisah kita menjadi karya terindah selamanya.
            </p>

            {/* Filter tabs */}
            <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-xs p-1.5 rounded-full bg-surface-container-high/80 shadow-sm backdrop-blur-md">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all ${
                    filter === f.id
                      ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span
                className="material-symbols-outlined text-primary animate-spin"
                style={{ fontSize: 48 }}
              >
                progress_activity
              </span>
              <p className="text-sm text-on-surface-variant">
                Memuat cerita kita... 💕
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && chapters.length === 0 && (
            <div className="text-center py-20 space-y-3">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: 56 }}
              >
                auto_stories
              </span>
              <h3 className="font-serif text-2xl text-on-surface">
                Belum ada kenangan
              </h3>
              <p className="text-sm text-on-surface-variant">
                Yuk tambahkan kenangan pertama kalian! 💕
              </p>
            </div>
          )}

          {/* Timeline */}
          {!loading && chapters.length > 0 && (
            <div className="relative w-full">
              <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary-container via-primary to-primary-container/40" />
              <div className="md:hidden absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary-container via-primary to-primary-container/30" />

              <div className="space-y-space-xl relative">
                {visible.map((c) => (
                  <TimelineCard key={c.id} chapter={c} />
                ))}
              </div>
            </div>
          )}

          {/* Bottom note */}
          {!loading && chapters.length > 0 && (
            <div className="mt-space-xl p-space-lg rounded-xl bg-surface-container-low/80 backdrop-blur-md text-center max-w-xl mx-auto shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl mb-1">
                hourglass_top
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                Babak Berikutnya Sedang Ditulis...
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Setiap hari bersamamu adalah lembar baru yang tak sabar ingin kuabadikan di sini.
              </p>
            </div>
          )}
        </div>
      </main>

      <MusicPlayer />
      <Footer />
    </>
  );
}
