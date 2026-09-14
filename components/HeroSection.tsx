'use client';
import { useRef } from 'react';

type Props = {
  coupleNames: string;
  badgeText: string;
  bio: string;
  photoUrl: string | null;
  photoDate?: string;
  photoCaption?: string;
  photoSubtitle?: string;
  startDate?: string;
};

export default function HeroSection({
  coupleNames,
  badgeText,
  bio,
  photoUrl,
  photoDate,
  photoCaption,
  photoSubtitle,
  startDate,
}: Props) {
  const burstBtnRef = useRef<HTMLButtonElement>(null);

  const handleBurst = () => {
    const btn = burstBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.position = 'fixed';
      heart.style.left = `${rect.left + rect.width / 2 + (Math.random() * 40 - 20)}px`;
      heart.style.top = `${rect.top + (Math.random() * 20 - 10)}px`;
      heart.style.fontSize = `${Math.random() * 14 + 14}px`;
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      heart.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
      document.body.appendChild(heart);
      const rx = (Math.random() - 0.5) * 120;
      const ry = -80 - Math.random() * 80;
      setTimeout(() => {
        heart.style.transform = `translate(${rx}px, ${ry}px) scale(0)`;
        heart.style.opacity = '0';
      }, 20);
      setTimeout(() => heart.remove(), 1300);
    }
  };

  // Format tanggal dari start_date kalau photoDate kosong
  const fallbackDate = startDate
    ? new Date(startDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '14 Feb 2022';

  return (
    <section className="max-w-7xl mx-auto w-full pt-4 pb-16 lg:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-12 items-center">
        {/* LEFT: Text */}
        <div className="lg:col-span-6 flex flex-col items-start gap-space-md order-2 lg:order-1">
          <div className="inline-flex items-center gap-space-xs px-4 py-1.5 rounded-full bg-surface-container-low/90 backdrop-blur-md text-primary shadow-sm">
            <span
              className="material-symbols-outlined text-[18px] text-primary animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              {badgeText}
            </span>
          </div>

          <div className="flex flex-col gap-space-xs">
            <h1 className="font-display-lg text-display-lg text-primary tracking-tight font-semibold">
              Our Love Story
            </h1>
            <p className="font-headline-sm text-headline-sm text-secondary font-medium">
              {coupleNames} — Dua Hati, Satu Cerita Abadi
            </p>
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            {bio}
          </p>

          <div className="flex flex-wrap items-center gap-space-md pt-2">
            <a
              href="#counter-section"
              className="inline-flex items-center justify-center gap-space-xs px-7 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <span>Hitung Waktu Cinta Kita</span>
              <span className="material-symbols-outlined text-[18px]">
                keyboard_arrow_down
              </span>
            </a>
            <button
              ref={burstBtnRef}
              onClick={handleBurst}
              className="inline-flex items-center justify-center gap-space-xs px-6 py-3 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-md text-label-md font-semibold shadow-sm hover:bg-primary-fixed transition-all"
            >
              <span
                className="material-symbols-outlined text-[18px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              <span>Kirim Peluk &amp; Cinta</span>
            </button>
          </div>

          <div className="mt-4 p-space-md rounded-2xl bg-surface-container-low/60 backdrop-blur-md flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[26px]">
              format_quote
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant italic">
              "Aku mencintaimu bukan hanya untuk siapa dirimu, tetapi untuk siapa diriku saat
              bersamamu."
            </p>
          </div>
        </div>

        {/* RIGHT: Polaroid */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          <div className="relative group transition-transform duration-500 hover:rotate-0 rotate-[-2.5deg]">
            <div className="absolute -top-4 -left-6 z-20 w-24 h-7 bg-surface-container-highest/90 backdrop-blur-sm -rotate-45 shadow-sm opacity-90 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-surface-dim/40 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-6 z-20 w-28 h-8 bg-surface-container-highest/90 backdrop-blur-sm -rotate-30 shadow-sm opacity-90 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-surface-dim/40 to-transparent" />
            </div>

            <div className="p-4 sm:p-5 pb-6 sm:pb-7 rounded-2xl bg-surface-container-lowest shadow-[0_20px_45px_-10px_rgba(135,78,88,0.18)] max-w-sm sm:max-w-md">
              <div className="relative overflow-hidden rounded-xl bg-surface-container aspect-square shadow-inner">
                {photoUrl ? (
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={coupleNames}
                    src={photoUrl}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-fixed/40 to-secondary-container/40">
                    <span
                      className="material-symbols-outlined text-primary/60"
                      style={{ fontSize: 80, fontVariationSettings: "'FILL' 1" }}
                    >
                      favorite
                    </span>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-on-surface/50 backdrop-blur-md text-on-primary font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    wb_twilight
                  </span>
                  <span>{photoDate || fallbackDate}</span>
                </div>
              </div>

              <div className="pt-4 px-1 text-center">
                <p className="font-headline-sm text-headline-sm text-primary italic font-serif">
                  "{photoCaption || 'The sunset that started everything 🌅'}"
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">
                  {photoSubtitle || coupleNames.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
