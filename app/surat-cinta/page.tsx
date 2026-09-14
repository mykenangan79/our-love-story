'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import Footer from '@/components/Footer';
import LetterCard from '@/components/surat/LetterCard';
import SweetQuote from '@/components/surat/SweetQuote';
import { supabase } from '@/lib/supabase';
import { rowToLetter, type Letter, type LetterRow } from '@/lib/letters-data';

export default function SuratCintaPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Fetch letters dari Supabase
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch letters error:', error);
      } else if (data) {
        setLetters((data as LetterRow[]).map((row, i) => rowToLetter(row, i)));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Generate filter tabs dinamis dari letters
  const FILTERS = useMemo(() => {
    const base: { id: string; label: string; count: number; icon?: string }[] = [
      { id: 'all', label: 'Semua Surat', count: letters.length },
    ];

    // Ambil author unik
    const authors = Array.from(new Set(letters.map((l) => l.from)));
    authors.forEach((author) => {
      const count = letters.filter((l) => l.from === author).length;
      base.push({ id: author, label: `Dari ${author}`, count });
    });

    // Filter sealed
    const sealedCount = letters.filter((l) => l.variant === 'sealed').length;
    if (sealedCount > 0) {
      base.push({
        id: 'sealed',
        label: 'Surat Tersegel',
        count: sealedCount,
        icon: 'lock_clock',
      });
    }

    return base;
  }, [letters]);

  // Filter logic
  const visible = useMemo(() => {
    if (filter === 'all') return letters;
    if (filter === 'sealed') return letters.filter((l) => l.variant === 'sealed');
    return letters.filter((l) => l.from === filter);
  }, [letters, filter]);

  return (
    <>
      <Navbar />

      <main className="w-full pt-20 flex-1 relative z-10">
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-24 left-1/3 w-80 h-80 rounded-full bg-primary-container/25 blur-3xl pointer-events-none" />
          <div className="absolute top-48 -left-20 w-96 h-96 rounded-full bg-tertiary-container/30 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-gutter-sm sm:px-gutter lg:px-margin py-8 sm:py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-widest shadow-sm">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    mark_email_unread
                  </span>
                  <span>Intimate Keepsake &amp; Secret Parchment</span>
                </div>
                <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
                  Kotak Surat Cinta Kita
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Pesan-pesan rahasia, janji manis, dan kata-kata tulus yang hanya kita berdua
                  yang tahu.
                </p>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-4 border-primary-container/30" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                </div>
                <p className="text-sm text-on-surface-variant">Memuat surat cinta... 💌</p>
              </div>
            )}

            {/* Empty */}
            {!loading && letters.length === 0 && (
              <div className="text-center py-20 space-y-3">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontSize: 56 }}
                >
                  mail
                </span>
                <h3 className="font-serif text-2xl text-on-surface">
                  Belum ada surat cinta
                </h3>
                <p className="text-sm text-on-surface-variant">
                  Yuk tulis surat cinta pertama! 💕
                </p>
              </div>
            )}

            {/* Content */}
            {!loading && visible.length > 0 && (
              <>
                {/* Filter tabs */}
                <div className="flex flex-wrap items-center gap-2 mb-12">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all duration-200 flex items-center gap-1.5 ${
                        filter === f.id
                          ? 'bg-primary text-on-primary shadow-sm font-medium'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'
                      }`}
                    >
                      {f.icon && (
                        <span className="material-symbols-outlined text-[15px]">
                          {f.icon}
                        </span>
                      )}
                      <span>
                        {f.label} ({f.count})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Letters grid */}
                <div className="flex flex-wrap gap-8 items-start mb-16 -mx-4">
                  {visible.map((l) => {
                    const widthClass =
                      l.span === 'md:col-span-7'
                        ? 'w-full lg:w-[58%]'
                        : l.span === 'md:col-span-5'
                        ? 'w-full lg:w-[38%]'
                        : 'w-full lg:w-[48%]';
                    return (
                      <div key={l.id} className={`px-4 ${widthClass}`}>
                        <LetterCard letter={l} />
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Sweet Quote */}
            {!loading && letters.length > 0 && <SweetQuote />}
          </div>
        </div>
      </main>

      <MusicPlayer />
      <Footer />
    </>
  );
}
