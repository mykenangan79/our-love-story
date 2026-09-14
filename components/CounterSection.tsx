'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Milestone = {
  id: string;
  title: string;
  emoji: string;
  offset_days: number | null;
  target_date: string | null;
  status: string;
};

type CounterSectionProps = {
  startDate: string;
};

export default function CounterSection({ startDate }: CounterSectionProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Live clock
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch milestones
  useEffect(() => {
    async function fetchMilestones() {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('offset_days', { ascending: true });

      if (!error && data) {
        setMilestones(data as Milestone[]);
      }
    }
    fetchMilestones();
  }, []);

  // Hitung counter
  let days = 0, months = 0, years = 0;
  let hh = '00', mm = '00', ss = '00';

  if (now) {
    const start = new Date(startDate);
    const diffMs = now.getTime() - start.getTime();
    if (diffMs >= 0) {
      days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      months =
        (now.getFullYear() - start.getFullYear()) * 12 +
        (now.getMonth() - start.getMonth()) -
        (now.getDate() < start.getDate() ? 1 : 0);
      years = Math.floor(months / 12);
    }
    hh = now.getHours().toString().padStart(2, '0');
    mm = now.getMinutes().toString().padStart(2, '0');
    ss = now.getSeconds().toString().padStart(2, '0');
  }

  const counters = [
    { label: 'Total Hari', value: days.toLocaleString('id-ID'), sub: 'Hari penuh cerita cinta', icon: 'today' },
    { label: 'Total Bulan', value: months.toString(), sub: 'Bulan tumbuh bersama', icon: 'calendar_month' },
    { label: 'Total Tahun', value: years.toString(), sub: 'Tahun merangkai mimpi', icon: 'hourglass_bottom' },
  ];

  // Compute milestone status dari start_date + offset_days
  const startDateObj = new Date(startDate);
  const milestonesWithStatus = milestones.map((m) => {
    const offset = m.offset_days ?? 100;
    const target = new Date(startDateObj);
    target.setDate(target.getDate() + offset);

    const nowTime = now ? now.getTime() : Date.now();
    const diffMs = target.getTime() - nowTime;
    const daysUntil = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const unlocked = target.getTime() <= nowTime;
    const isRecent = unlocked && daysUntil > -30 && daysUntil <= 0;

    return {
      ...m,
      unlocked,
      isRecent,
      daysUntil,
    };
  });

  // Untuk tampilan: ambil 6 milestone pertama
  const displayMilestones = milestonesWithStatus.slice(0, 6);

  // Icon map
  const iconMap: Record<string, string> = {
    '1 Bulan': 'favorite',
    '100 Hari': 'verified_user',
    '1 Tahun': 'cake',
    '2 Tahun': 'hotel_class',
    '3 Tahun': 'local_bar',
    '1.000 Hari': 'stars',
    '500 Hari': 'celebration',
    '5 Tahun': 'workspace_premium',
  };

  // Warna bg berdasarkan status
  const getMilestoneStyle = (m: any) => {
    if (m.isRecent) {
      // Yang baru saja terbuka → highlight pink
      return 'bg-primary text-on-primary ring-2 ring-primary-container';
    }
    if (m.unlocked) {
      // Sudah terbuka → cream
      return 'bg-surface-container-low/90 backdrop-blur-md';
    }
    // Belum terbuka → muted
    return 'bg-surface-container-highest/60 opacity-60';
  };

  const getIconBg = (m: any) => {
    if (m.isRecent) return 'bg-on-primary/20 text-on-primary';
    if (m.unlocked) return 'bg-tertiary-container/60 text-on-tertiary-container';
    return 'bg-surface-container-high text-outline';
  };

  const getLabel = (m: any) => {
    if (m.isRecent) return 'Baru Terbuka 🎉';
    if (m.unlocked) return 'Terbuka ✅';
    return `${Math.abs(m.daysUntil).toLocaleString('id-ID')} hari lagi`;
  };

  const getLabelColor = (m: any) => {
    if (m.isRecent) return 'text-primary-fixed';
    if (m.unlocked) return 'text-primary';
    return 'text-outline';
  };

  return (
    <section id="counter-section" className="max-w-6xl mx-auto w-full mb-20 lg:mb-28">
      <div className="relative rounded-3xl bg-surface-container-lowest/80 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 shadow-[0_24px_50px_-12px_rgba(92,46,62,0.12),0_4px_20px_-2px_rgba(255,154,158,0.2)]">
        <div className="absolute -top-16 right-12 w-64 h-64 rounded-full bg-primary-container/25 blur-2xl pointer-events-none -z-10" />
        <div className="absolute -bottom-16 left-8 w-72 h-72 rounded-full bg-tertiary-container/30 blur-2xl pointer-events-none -z-10" />

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-space-xs mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            <span className="material-symbols-outlined text-[16px]">celebration</span>
            <span>Real-time Journey</span>
          </div>
          <h2 className="font-display-lg text-display-lg text-primary font-semibold">
            Waktu yang Kita Lewati Bersama 💕
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
            Setiap detiknya berharga, setiap harinya dipenuhi tawa dan cinta kita berdua.
          </p>
        </div>

        {/* Counter Besar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md lg:gap-space-lg mb-10">
          {counters.map((c) => (
            <div
              key={c.label}
              className="relative overflow-hidden rounded-2xl bg-surface-container-low/90 backdrop-blur-md p-6 text-center shadow-sm hover:shadow-md transition-all"
            >
              <div className="absolute top-2 right-3 opacity-10 text-primary">
                <span className="material-symbols-outlined text-6xl">{c.icon}</span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                {c.label}
              </span>
              <div className="font-display-lg text-display-lg text-primary font-bold my-1 tracking-tight">
                {now ? c.value : '—'}
              </div>
              <span className="font-body-md text-xs text-on-surface-variant">{c.sub}</span>
            </div>
          ))}
        </div>

        {/* Live Clock */}
        <div className="rounded-2xl bg-surface-container-high/60 backdrop-blur-md p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">timer</span>
            </div>
            <div className="text-left">
              <span className="font-title-md text-title-md text-on-surface font-semibold block">
                Detik yang Berjalan
              </span>
              <span className="font-body-md text-xs text-on-surface-variant">
                Setiap hembusan napas kebersamaan kita
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {[
              { val: hh, label: 'Jam' },
              { val: mm, label: 'Menit' },
              { val: ss, label: 'Detik' },
            ].map((t, i) => (
              <div key={t.label} className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-surface-container-lowest text-primary font-display-lg text-headline-lg flex items-center justify-center shadow-sm font-bold">
                    {t.val}
                  </div>
                  <span className="font-label-sm text-[10px] uppercase text-on-surface-variant mt-1">
                    {t.label}
                  </span>
                </div>
                {i < 2 && (
                  <span className="text-primary animate-ping">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      favorite
                    </span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Dinamis */}
        <div className="flex flex-col items-start w-full">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
            <span className="font-title-md text-title-md text-primary font-semibold">
              Pencapaian Kisah Kita
            </span>
          </div>

          {milestones.length === 0 ? (
            <div className="w-full text-center py-8">
              <span className="material-symbols-outlined text-primary/40 text-4xl">workspace_premium</span>
              <p className="text-xs text-on-surface-variant mt-2">
                Belum ada milestone. Tambahkan dari admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
              {displayMilestones.map((m: any) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl flex flex-col items-center text-center shadow-sm transition-transform hover:scale-105 ${getMilestoneStyle(m)}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 ${getIconBg(m)} ${m.isRecent ? 'animate-bounce' : ''}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {iconMap[m.title] || 'emoji_events'}
                    </span>
                  </div>
                  <span
                    className={`font-label-sm text-xs ${m.isRecent ? 'font-bold text-on-primary' : 'font-semibold text-on-surface'}`}
                  >
                    {m.title}
                  </span>
                  <span
                    className={`font-label-sm text-[10px] mt-0.5 ${getLabelColor(m)}`}
                  >
                    {getLabel(m)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
