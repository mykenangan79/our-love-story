'use client';
import { useState } from 'react';
import { Letter } from '@/lib/letters-data';

export default function LetterCard({ letter }: { letter: Letter }) {
  const [likes, setLikes] = useState(letter.likes ?? 0);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <article className="flex flex-col rounded-3xl bg-surface-container-lowest/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_16px_36px_-6px_rgba(92,46,62,0.08),0_4px_16px_rgba(255,182,193,0.12)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden w-full">
      {/* ─────────────────────────── OPENED ─────────────────────────── */}
      {letter.variant === 'opened' && (
        <>
          <div className="flex items-start justify-between gap-4 pb-5 flex-wrap">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full ${letter.authorBadgeClass} flex items-center justify-center font-headline-sm text-base shadow-sm shrink-0`}
              >
                {letter.authorInitial}
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                  Dari {letter.from} • Untuk {letter.to}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  {letter.title}
                </span>
              </div>
            </div>
            {letter.readCount && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container/60 text-on-secondary-container font-label-sm text-label-sm shadow-sm shrink-0">
                <span
                  className="material-symbols-outlined text-[16px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
                <span>Dibaca {letter.readCount}x 💕</span>
              </div>
            )}
          </div>

          <div className="relative rounded-2xl bg-surface-container-low/70 p-6 sm:p-7 shadow-inner space-y-4">
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant/70 pb-2 flex-wrap gap-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">
                  calendar_today
                </span>
                {letter.date}
              </span>
              <span className="italic font-serif">{letter.location}</span>
            </div>

            <p className="font-serif text-lg sm:text-xl text-on-surface leading-relaxed italic font-normal">
              {letter.quote}
            </p>

            {letter.body && (
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {letter.body}
              </p>
            )}

            {letter.signature && (
              <div className="pt-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-px bg-primary/40" />
                  <span className="font-headline-sm text-sm text-primary italic">
                    {letter.signature}
                  </span>
                </div>
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1.5 text-xs font-label-md text-primary hover:text-on-primary-container px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm hover:scale-105 transition-all"
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                  <span>{likes}</span>
                </button>
              </div>
            )}
          </div>

          {letter.attachment && (
            <div className="mt-5 flex items-center gap-4 p-3 rounded-2xl bg-surface-container-high/40">
              <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0 bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt={letter.attachment.title}
                  src={letter.attachment.image}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  {letter.attachment.title}
                </span>
                <span className="font-body-md text-xs text-on-surface-variant truncate">
                  {letter.attachment.caption}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─────────────────────────── SEALED ─────────────────────────── */}
      {letter.variant === 'sealed' && (
        <>
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-secondary-container/40 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-start justify-between pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full ${letter.authorBadgeClass} flex items-center justify-center font-headline-sm text-base shadow-sm shrink-0`}
              >
                {letter.authorInitial}
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary font-semibold">
                  Dari {letter.from} • Amplop Rahasia
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {letter.title}
                </h3>
              </div>
            </div>
          </div>

          <div className="relative w-full rounded-2xl bg-gradient-to-b from-surface-container-high to-surface-container-low p-7 flex flex-col items-center justify-center text-center space-y-4 shadow-sm my-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary shadow-[0_8px_20px_rgba(135,78,88,0.25)] ring-4 ring-surface-container-lowest/80 animate-pulse">
              <span
                className="material-symbols-outlined text-[30px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>

            <div className="space-y-1 max-w-xs">
              <span className="inline-flex items-center gap-1 text-xs font-label-md uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                <span className="material-symbols-outlined text-[14px]">
                  lock
                </span>
                Tersegel Rapat
              </span>
              <p className="font-title-md text-title-md text-on-surface font-semibold pt-1">
                {letter.lockedUntil}
              </p>
              <p className="font-body-md text-xs text-on-surface-variant">
                Ditulis tangan pada {letter.date} menjelang fajar pertama tahun ini.
              </p>
            </div>

            <div className="w-full bg-surface-container-lowest/90 rounded-xl p-3 flex items-center justify-around text-center shadow-sm">
              <div className="flex flex-col">
                <span className="font-headline-sm text-lg text-primary">
                  {letter.lockedDays}
                </span>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">
                  Hari Tersisa
                </span>
              </div>
              <div className="w-px h-6 bg-surface-container-highest" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-lg text-primary">
                  {String(letter.lockedMonths).padStart(2, '0')}
                </span>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">
                  Bulan Menuju Janji
                </span>
              </div>
              <div className="w-px h-6 bg-surface-container-highest" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-lg text-primary">100%</span>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">
                  Masih Utuh
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  'Pstt... amplop ini masih terkunci mantra cinta! Buka hanya saat hari H ya sayang ❤️'
                )
              }
              className="w-full py-2.5 rounded-xl bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">
                lock_open
              </span>
              <span>Coba Intip Surat (Terkunci)</span>
            </button>
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Disimpan dalam brankas digital Our Love Story</span>
            <span className="font-medium text-primary">Vow Chapter</span>
          </div>
        </>
      )}

      {/* ─────────────────────────── NOTEBOOK ─────────────────────────── */}
      {letter.variant === 'notebook' && (
        <>
          <div className="relative flex items-start justify-between pb-4 gap-3 flex-wrap">
            <div className="absolute -top-3 left-6 w-5 h-10 rounded-full bg-secondary-fixed-dim/80 shadow-sm flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">
                attach_file
              </span>
            </div>
            <div className="pl-12 flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                Dari {letter.from} • Lembar Tahunan
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {letter.title}
              </h3>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-sm shrink-0">
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              Anniversary ✨
            </span>
          </div>

          <div className="rounded-2xl bg-surface-container-low/50 p-6 space-y-3 shadow-inner">
            <div className="flex items-center justify-between font-label-sm text-xs text-on-surface-variant flex-wrap gap-2">
              <span>{letter.date}</span>
              <span>{letter.location}</span>
            </div>

            <p className="font-serif text-lg text-on-surface leading-relaxed italic">
              {letter.quote}
            </p>

            {letter.body && (
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {letter.body}
              </p>
            )}

            <div className="pt-3 flex items-center justify-between flex-wrap gap-2">
              <span className="font-headline-sm text-sm text-primary font-medium">
                — {letter.signature}
              </span>
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-xs font-label-md text-primary px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm hover:scale-105 transition-all"
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
                <span>{likes}</span>
              </button>
            </div>
          </div>

          {letter.voiceNote && (
            <div className="mt-4 p-3 rounded-2xl bg-surface-container flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">
                    play_arrow
                  </span>
                </button>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    Catatan Suara Terlampir
                  </span>
                  <span className="font-body-md text-[11px] text-on-surface-variant">
                    {letter.voiceNote.label} • {letter.voiceNote.duration}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 h-5 px-2">
                <span className="w-0.5 h-2 bg-primary/70 rounded-full" />
                <span className="w-0.5 h-4 bg-primary rounded-full" />
                <span className="w-0.5 h-5 bg-primary rounded-full" />
                <span className="w-0.5 h-3 bg-primary/70 rounded-full" />
                <span className="w-0.5 h-4 bg-primary rounded-full" />
              </div>
            </div>
          )}
        </>
      )}

      {/* ─────────────────────────── STICKY ─────────────────────────── */}
      {letter.variant === 'sticky' && (
        <>
          <div className="flex items-start justify-between pb-4 gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full ${letter.authorBadgeClass} flex items-center justify-center font-headline-sm text-base shadow-sm shrink-0`}
              >
                {letter.authorInitial}
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                  Dari {letter.from} • Emergency Note 🩹
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {letter.title}
                </h3>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-secondary-container/80 flex items-center justify-center text-on-secondary-container shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[16px]">
                sentiment_calm
              </span>
            </div>
          </div>

          <div className="relative rounded-2xl bg-surface-container-low/90 p-6 space-y-4 shadow-sm">
            <p className="font-serif text-lg sm:text-xl text-on-surface leading-relaxed italic">
              {letter.quote}
            </p>

            {letter.body && (
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {letter.body}
              </p>
            )}

            {letter.checklist && (
              <div className="p-3 rounded-xl bg-surface-container-lowest/70 space-y-2">
                {letter.checklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-on-surface font-label-md"
                  >
                    <span
                      className="material-symbols-outlined text-[16px] text-primary shrink-0"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              <span className="font-label-sm text-xs text-on-surface-variant">
                Tersedia 24/7 di sakumu
              </span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs font-semibold shadow-sm hover:scale-105 transition-all">
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  volunteer_activism
                </span>
                <span>Kirim Sinyal Mau Baikan</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant flex-wrap gap-2">
            <span>Status: Selalu aktif saat darurat</span>
            <span className="font-medium text-primary">
              {letter.from}'s First-Aid Heart
            </span>
          </div>
        </>
      )}
    </article>
  );
}
