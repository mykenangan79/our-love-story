'use client';
import { WishlistItem as WItem } from '@/lib/milestones-data';

export default function WishlistItem({
  item,
}: {
  item: WItem;
  onConfetti?: () => void;
}) {
  // PUBLIC = READ-ONLY. Bulatan cuma display, TIDAK bisa diklik.
  const isDone = item.done;

  return (
    <div className="p-6 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-sm hover:shadow-md transition-all flex items-start gap-4">
      {/* Checkbox — display only, read-only */}
      <div
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${
          isDone
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container-high text-on-surface-variant shadow-inner'
        }`}
        aria-label={isDone ? 'Sudah tercapai' : 'Belum tercapai'}
        role="img"
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 18,
            fontVariationSettings: isDone ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          {isDone ? 'check' : 'radio_button_unchecked'}
        </span>
      </div>

      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h4
            className={`text-on-surface font-semibold text-lg ${
              isDone ? 'line-through opacity-75' : ''
            }`}
          >
            {item.title}
          </h4>
          {item.badge && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                item.badgeClass || 'bg-secondary-fixed text-on-secondary-fixed'
              }`}
            >
              {item.badge}
            </span>
          )}
        </div>

        <p className="text-on-surface-variant text-sm">{item.desc}</p>

        {item.location && (
          <div className="flex items-center gap-2 pt-2 text-on-surface-variant text-[11px] font-semibold">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: 15 }}
            >
              location_on
            </span>
            <span>{item.location}</span>
          </div>
        )}

        {item.meta && item.meta.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 pt-2 text-on-surface-variant text-[11px] font-semibold">
            {item.meta.map((m, i) => (
              <div key={i} className="flex items-center gap-1">
                <span
                  className={`material-symbols-outlined ${
                    m.color === 'secondary' ? 'text-secondary' : 'text-primary'
                  }`}
                  style={{ fontSize: 15 }}
                >
                  {m.icon}
                </span>
                <span>{m.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
