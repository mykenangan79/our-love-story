// ═══════════════════════════════════════════════════════════
// TYPES + HELPER — data dari Supabase (tabel: memories)
// ═══════════════════════════════════════════════════════════

export type Chapter = {
  id: string;
  bab: string;
  category: 'kencan' | 'liburan' | 'milestone';
  badge: string;
  badgeClass: string;
  date: string;
  title: string;
  location: string;
  locationIcon: string;
  story: string;
  emoji: string;
  position: 'left' | 'right';
  photos?: string[];
  polaroid?: { image: string; caption: string };
  quote?: string;
  voiceNote?: { title: string; text: string; duration: string };
  reactions: { emoji: string; count: number }[];
  sideNote?: string;
  sideTitle?: string;
  sideDesc?: string;
  isMilestoneBig?: boolean;
};

export type MemoryRow = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  description: string | null;
  category: string;
  photo_url: string | null;
  is_public: boolean;
  created_at: string;
};

// Mapping kategori ke visual
const CATEGORY_MAP: Record<
  string,
  { badge: string; badgeClass: string; emoji: string; locationIcon: string }
> = {
  Kencan: {
    badge: 'Kencan',
    badgeClass: 'bg-secondary-fixed-dim/60 text-on-secondary-fixed',
    emoji: '☕',
    locationIcon: 'storefront',
  },
  Liburan: {
    badge: 'Liburan',
    badgeClass: 'bg-tertiary-container text-on-tertiary-container',
    emoji: '🌺',
    locationIcon: 'place',
  },
  Milestone: {
    badge: 'Milestone',
    badgeClass: 'bg-primary text-on-primary font-semibold tracking-wide',
    emoji: '💖',
    locationIcon: 'wb_twilight',
  },
  Candid: {
    badge: 'Candid',
    badgeClass: 'bg-surface-container-high text-on-surface-variant',
    emoji: '📸',
    locationIcon: 'photo_camera',
  },
};

export function memoryToChapter(memory: MemoryRow, index: number): Chapter {
  const meta = CATEGORY_MAP[memory.category] ?? CATEGORY_MAP.Kencan;
  const isMilestoneBig = memory.category === 'Milestone';

  const formattedDate = new Date(memory.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Kategori lowercase untuk filter
  let category: 'kencan' | 'liburan' | 'milestone' = 'kencan';
  const catLower = memory.category.toLowerCase();
  if (catLower.includes('libur')) category = 'liburan';
  else if (catLower.includes('milestone')) category = 'milestone';

  return {
    id: memory.id,
    bab: `#Babak${String(index + 1).padStart(2, '0')}`,
    category,
    badge: meta.badge,
    badgeClass: meta.badgeClass,
    date: formattedDate,
    title: memory.title,
    location: memory.location ?? '',
    locationIcon: meta.locationIcon,
    story: memory.description ?? '',
    emoji: meta.emoji,
    position: index % 2 === 0 ? 'left' : 'right',
    photos: memory.photo_url ? [memory.photo_url] : undefined,
    reactions: [
      { emoji: '❤️', count: 0 },
      { emoji: '😍', count: 0 },
    ],
    sideNote: `#Babak${String(index + 1).padStart(2, '0')} • ${memory.location ?? ''}`,
    isMilestoneBig,
    sideTitle: isMilestoneBig ? 'Titik Balik Terbaik' : undefined,
    sideDesc: isMilestoneBig
      ? 'Ketika dua cerita pribadi melebur menjadi satu nama perjalanan kita.'
      : undefined,
  };
}
