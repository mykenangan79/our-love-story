'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Quote = {
  id: string;
  text: string;
  author: string;
  order_index: number;
};

export default function SweetQuote() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      const { data, error } = await supabase
        .from('sweet_quotes')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        setQuotes(data as Quote[]);
      }
      setLoading(false);
    }
    fetchQuotes();
  }, []);

  const next = () => {
    if (quotes.length === 0) return;
    setFading(true);
    setTimeout(() => {
      setIdx((i) => (i + 1) % quotes.length);
      setFading(false);
    }, 250);
  };

  if (loading || quotes.length === 0) return null;

  const current = quotes[idx];

  return (
    <section className="w-full relative rounded-3xl bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low p-8 sm:p-12 shadow-[0_20px_40px_-15px_rgba(92,46,62,0.08)] overflow-hidden mb-12">
      <div className="absolute -bottom-10 right-10 w-48 h-48 rounded-full bg-primary-container/20 blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-[0_8px_20px_rgba(135,78,88,0.2)]">
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
          </div>
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
              Inspirasi Hati
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Kata Manis Hari Ini
            </h2>
          </div>
        </div>

        <div className="flex-1 text-center lg:text-left px-0 lg:px-6">
          <p
            className={`font-serif text-lg sm:text-2xl text-on-surface leading-relaxed italic transition-opacity duration-300 ${
              fading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            &ldquo;{current.text}&rdquo;
          </p>
          <div
            className={`mt-2 font-headline-sm text-sm text-primary font-medium transition-opacity duration-300 ${
              fading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {current.author}
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={next}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-all duration-300 shadow-sm hover:shadow active:scale-95 group"
          >
            <span className="material-symbols-outlined text-[19px] transition-transform duration-500 group-hover:rotate-180 text-primary">
              cached
            </span>
            <span>Ganti Kata Manis</span>
          </button>
        </div>
      </div>
    </section>
  );
}
