'use client';
import { Milestone } from '@/lib/milestones-data';

export default function MilestoneBadge({
  milestone,
  onConfetti,
}: {
  milestone: Milestone;
  onConfetti?: () => void;
}) {
  const { status } = milestone;

  // FEATURED (3 Tahun — big highlight banner)
  if (status === 'featured') {
    return (
      <div className="relative lg:col-span-3 md:col-span-2 col-span-1 rounded-xl p-6 md:p-8 bg-gradient-to-br from-surface-container-lowest via-primary-fixed/25 to-surface-container-lowest backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-primary-container/40 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-4xl shadow-md ring-4 ring-primary-container/30 animate-bounce">
                {milestone.emoji}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-surface-container-lowest rounded-full shadow">
                <span
                  className="material-symbols-outlined text-[18px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {milestone.specialLabel && (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-semibold tracking-wider uppercase">
                    {milestone.specialLabel}
                  </span>
                )}
                <span className="text-on-surface-variant text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    calendar_month
                  </span>
                  {milestone.date}
                </span>
              </div>
              <h3 className="text-on-surface font-semibold" style={{ fontSize: 24 }}>
                {milestone.title}
              </h3>
              <p className="text-on-surface-variant text-sm max-w-xl">
                {milestone.desc}
              </p>
            </div>
          </div>
          {onConfetti && (
            <div className="shrink-0">
              <button
                onClick={onConfetti}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary text-[13px] font-medium shadow hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  celebration
                </span>
                <span>Putar Confetti 🎉</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // LOCKED
  if (status === 'locked') {
    return (
      <div className="relative rounded-xl p-6 bg-surface-container-high/60 backdrop-blur-sm shadow-sm flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex items-start justify-between gap-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center text-2xl filter grayscale opacity-70">
            {milestone.emoji}
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-semibold">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              {milestone.id === 'm10' ? 'all_inclusive' : 'lock'}
            </span>
            {milestone.id === 'm10' ? 'Menuju Selamanya' : 'Terkunci'}
          </span>
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-on-surface font-semibold" style={{ fontSize: 18 }}>
            {milestone.title}
          </h3>
          <p className="text-on-surface-variant text-sm">{milestone.desc}</p>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-on-surface-variant text-[11px] font-semibold gap-3">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              {milestone.daysLeft ? 'hourglass_top' : 'favorite'}
            </span>
            <span className={milestone.daysLeft ? '' : 'text-primary'}>
              {milestone.daysLeft || milestone.date}
            </span>
          </span>
          <span>{milestone.xp}</span>
        </div>
      </div>
    );
  }

  // UNLOCKED (default)
  return (
    <div className="relative rounded-xl p-6 bg-surface-container-lowest/85 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`w-14 h-14 rounded-2xl ${milestone.emojiBg} flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform`}
        >
          {milestone.emoji}
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-primary text-[11px] font-semibold">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          Terbuka
        </span>
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-on-surface font-semibold" style={{ fontSize: 18 }}>
          {milestone.title}
        </h3>
        <p className="text-on-surface-variant text-sm">{milestone.desc}</p>
      </div>
      <div className="mt-4 pt-3 flex items-center justify-between text-on-surface-variant text-[11px] font-semibold">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            event_available
          </span>
          {milestone.date}
        </span>
        <span className="text-secondary">{milestone.xp}</span>
      </div>
    </div>
  );
}
