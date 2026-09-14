'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import Footer from '@/components/Footer';
import MilestoneBadge from '@/components/milestones/MilestoneBadge';
import WishlistItem from '@/components/milestones/WishlistItem';
import { supabase } from '@/lib/supabase';
import {
  rowToMilestone,
  rowToWishlist,
  calcProgress,
  photoStrip,
  type Milestone,
  type MilestoneRow,
  type WishlistItem as WItem,
  type WishlistRow,
} from '@/lib/milestones-data';

function fireConfetti(originX?: number, originY?: number, count = 140) {
  if (typeof window === 'undefined') return;
  const canvas = document.getElementById('milestone-confetti-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#874e58', '#ffd9de', '#fcb3be', '#eddcfc', '#fdc7cb', '#d4c3e3', '#ffd700'];
  const particles: any[] = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: originX ?? window.innerWidth / 2,
      y: originY ?? window.innerHeight * 0.4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      angle: Math.random() * 360,
      angleSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      decay: Math.random() * 0.015 + 0.008,
    });
  }

  function loop() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.angle += p.angleSpeed;
      p.opacity -= p.decay;
      if (p.opacity <= 0 || p.y > canvas.height) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    if (particles.length > 0) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  loop();
}

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [wishlist, setWishlist] = useState<WItem[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [milestonesRes, wishlistRes, settingsRes] = await Promise.all([
        supabase
          .from('milestones')
          .select('*')
          .order('offset_days', { ascending: true }),
        supabase
          .from('wishlist')
          .select('*')
          .order('created_at', { ascending: true }),
        supabase.from('settings').select('start_date').single(),
      ]);

      const sd = settingsRes.data?.start_date ?? null;
      setStartDate(sd);

      if (milestonesRes.data) {
        setMilestones(
          (milestonesRes.data as MilestoneRow[]).map((row) =>
            rowToMilestone(row, sd)
          )
        );
      }
      if (wishlistRes.data) {
        setWishlist((wishlistRes.data as WishlistRow[]).map(rowToWishlist));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const progress = calcProgress(milestones, startDate ?? undefined);

  return (
    <>
      <Navbar />
      <canvas
        id="milestone-confetti-canvas"
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      <main className="w-full pt-20 flex-1 relative z-10">
        <div className="flex flex-col w-full">
          {/* HERO */}
          <section className="relative px-6 lg:px-8 pt-6 pb-12 overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold uppercase tracking-wider">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 15, fontVariationSettings: "'FILL' 1" }}
                    >
                      workspace_premium
                    </span>
                    <span>Perjalanan Cinta Kita</span>
                  </div>
                  <h1 className="font-serif text-3xl lg:text-4xl text-primary tracking-tight font-semibold">
                    Pencapaian &amp; Jejak Langkah Cinta
                  </h1>
                  <p className="text-on-surface-variant text-base">
                    Merayakan setiap detik, bulan, dan tahun cinta yang kita bangun bersama.
                  </p>
                </div>
                <div className="shrink-0">
                  <button
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                      fireConfetti(rect.left + rect.width / 2, rect.top, 140);
                    }}
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-[13px] font-medium shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <span
                      className="material-symbols-outlined group-hover:rotate-12 transition-transform"
                      style={{ fontSize: 18 }}
                    >
                      celebration
                    </span>
                    <span>Rayakan Momen Ini 🎉</span>
                  </button>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <span
                    className="material-symbols-outlined text-primary animate-spin"
                    style={{ fontSize: 48 }}
                  >
                    progress_activity
                  </span>
                  <p className="text-sm text-on-surface-variant">
                    Memuat milestone... 🏆
                  </p>
                </div>
              )}

              {/* Progress banner */}
              {!loading && milestones.length > 0 && (
                <div className="relative rounded-xl p-6 md:p-10 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_12px_32px_-4px_rgba(92,46,62,0.08),0_4px_12px_-2px_rgba(255,154,158,0.12)] overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary-container/40 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-tertiary-container/30 blur-3xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                            Live Progress Tracker
                          </span>
                        </div>
                        <h2 className="text-on-surface font-semibold" style={{ fontSize: 24 }}>
                          Menuju Milestone Berikutnya:{' '}
                          <span className="text-primary italic">
                            {progress.nextTitle}
                          </span>
                        </h2>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="px-4 py-2 rounded-lg bg-surface-container-high text-center">
                          <span
                            className="block leading-tight text-primary"
                            style={{ fontSize: 20, fontWeight: 600 }}
                          >
                            {progress.daysLeft}
                          </span>
                          <span className="text-[11px] font-semibold text-on-surface-variant uppercase">
                            Hari Lagi
                          </span>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-surface-container-high text-center">
                          <span
                            className="block leading-tight text-secondary"
                            style={{ fontSize: 20, fontWeight: 600 }}
                          >
                            {progress.percent}%
                          </span>
                          <span className="text-[11px] font-semibold text-on-surface-variant uppercase">
                            Tercapai
                          </span>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed text-center">
                          <span
                            className="block leading-tight"
                            style={{ fontSize: 20, fontWeight: 600 }}
                          >
                            {progress.daysPassed}
                          </span>
                          <span className="text-[11px] font-semibold uppercase">
                            Hari Terlewati
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full h-4 rounded-full bg-surface-container-highest/80 p-0.5 shadow-inner overflow-hidden relative">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-container via-primary to-secondary-fixed-dim transition-all duration-1000 relative"
                          style={{ width: `${progress.percent}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-on-surface-variant text-[11px] font-semibold flex-wrap gap-2">
                        <span className="flex items-center gap-1 text-on-surface">
                          <span
                            className="material-symbols-outlined text-primary"
                            style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
                          >
                            check_circle
                          </span>
                          {progress.currentLabel}
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 16 }}
                          >
                            lock_clock
                          </span>
                          {progress.nextLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* MILESTONE CARDS */}
          {!loading && milestones.length > 0 && (
            <section className="px-6 lg:px-8 py-8">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-on-surface font-semibold" style={{ fontSize: 24 }}>
                      Koleksi Lencana Cinta ({milestones.length} Milestones)
                    </h2>
                    <p className="text-on-surface-variant text-sm">
                      {progress.currentLabel} •{' '}
                      {milestones.filter((m) => m.status === 'locked').length} terkunci
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {milestones.map((m) => (
                    <MilestoneBadge
                      key={m.id}
                      milestone={m}
                      onConfetti={
                        m.status !== 'locked'
                          ? () =>
                              fireConfetti(
                                window.innerWidth / 2,
                                window.innerHeight * 0.5,
                                160
                              )
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PHOTO STRIP */}
          {!loading && milestones.length > 0 && (
            <section className="px-6 lg:px-8 py-8">
              <div className="max-w-6xl mx-auto rounded-xl p-6 bg-surface-container-low/70 backdrop-blur-md shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center md:text-left">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                      Dokumentasi Momen Emas
                    </span>
                    <h3
                      className="text-on-surface font-semibold"
                      style={{ fontSize: 20 }}
                    >
                      Perjalanan Kita Dalam Potret Kenangan
                    </h3>
                    <p className="text-on-surface-variant text-sm">
                      Setiap lencana di atas memiliki kisahnya masing-masing di galeri foto.
                    </p>
                  </div>
                  <div className="flex items-center -space-x-4">
                    {photoStrip.map((p, i) => (
                      <div
                        key={i}
                        className={`w-20 h-24 p-1 rounded-lg bg-surface-container-lowest shadow-md transition-all hover:rotate-0 hover:scale-110 hover:z-20 ${
                          i === 0
                            ? 'rotate-[-6deg]'
                            : i === 1
                            ? 'rotate-[3deg] z-10'
                            : 'rotate-[-2deg]'
                        }`}
                      >
                        <img
                          className="w-full h-16 object-cover rounded"
                          alt={p.label}
                          src={p.image}
                        />
                        <p className="text-[9px] text-center text-on-surface-variant mt-0.5">
                          {p.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* BUCKET LIST */}
          {!loading && wishlist.length > 0 && (
            <section className="px-6 lg:px-8 pt-4 pb-16">
              <div className="max-w-6xl mx-auto space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-[11px] font-semibold uppercase tracking-wider mb-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      checklist_rtl
                    </span>
                    <span>Impian Masa Depan</span>
                  </div>
                  <h2 className="text-on-surface font-semibold" style={{ fontSize: 24 }}>
                    Daftar Keinginan Berdua (Bucket List)
                  </h2>
                  <p className="text-on-surface-variant text-sm">
                    Cita-cita dan petualangan yang ingin kita wujudkan berdampingan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map((w) => (
                    <WishlistItem
                      key={w.id}
                      item={w}
                      onConfetti={() =>
                        fireConfetti(
                          window.innerWidth / 2,
                          window.innerHeight * 0.5,
                          40
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <MusicPlayer />
      <Footer />
    </>
  );
}
