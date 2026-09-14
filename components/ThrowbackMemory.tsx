'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type ThrowbackData = {
  enabled: boolean;
  date: string;
  badge: string;
  quote: string;
  story: string;
  photoUrl: string | null;
  location: string;
};

export default function ThrowbackMemory() {
  const [data, setData] = useState<ThrowbackData | null>(null);
  const [likes, setLikes] = useState(384);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThrowback() {
      const { data: settings } = await supabase
        .from('settings')
        .select(
          'throwback_enabled, throwback_date, throwback_badge, throwback_quote, throwback_story, throwback_photo_url, throwback_location'
        )
        .single();

      if (settings) {
        setData({
          enabled: settings.throwback_enabled ?? true,
          date: settings.throwback_date ?? '',
          badge: settings.throwback_badge ?? '',
          quote: settings.throwback_quote ?? '',
          story: settings.throwback_story ?? '',
          photoUrl: settings.throwback_photo_url,
          location: settings.throwback_location ?? '',
        });
      }
      setLoading(false);
    }
    fetchThrowback();
  }, []);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Tautan kenangan disalin! ❤️');
    } catch {
      alert('Gagal menyalin tautan.');
    }
  };

  if (loading || !data || !data.enabled) return null;

  // Format tanggal
  const dateLabel = data.date
    ? new Date(data.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <section className="max-w-5xl mx-auto w-full mb-12">
      <div className="relative rounded-3xl bg-surface-container-lowest/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_16px_40px_-8px_rgba(135,78,88,0.12)]">
        <div className="absolute -top-3 left-12 w-20 h-6 bg-surface-container-highest/90 backdrop-blur-sm -rotate-6 shadow-sm pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-surface-container-high pb-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                auto_stories
              </span>
            </div>
            <div>
              <h3 className="font-title-md text-title-md text-primary font-semibold">
                Kenangan Hari Ini
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Flashback kenangan manis kita di tanggal yang sama
              </p>
            </div>
          </div>
          {dateLabel && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px] text-primary">
                event_repeat
              </span>
              <span>{dateLabel}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative group">
            <div className="p-3 bg-surface-container-lowest rounded-2xl shadow-md rotate-1 group-hover:rotate-0 transition-transform duration-300">
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-surface-container">
                {data.photoUrl ? (
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={data.badge}
                    src={data.photoUrl}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-fixed/40 to-secondary-container/40">
                    <span
                      className="material-symbols-outlined text-primary/60"
                      style={{ fontSize: 64, fontVariationSettings: "'FILL' 1" }}
                    >
                      favorite
                    </span>
                  </div>
                )}
                {data.location && (
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-on-surface/50 backdrop-blur-md text-on-primary text-[10px] font-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      location_on
                    </span>
                    <span>{data.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              {data.badge && (
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                  {data.badge}
                </span>
              )}
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                "{data.quote}"
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                {data.story}
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-surface-container-high/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md text-label-md font-semibold transition-colors ${
                    liked
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-primary-container/40 text-on-primary-container hover:bg-primary-container'
                  }`}
                  type="button"
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                  <span>{likes}</span>
                  <span className="text-xs font-normal">Peluk</span>
                </button>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors font-label-sm text-label-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>Bagikan Kisah</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
