// ═══════════════════════════════════════════════════════════
// TYPES + HELPER — data dari Supabase (tabel: milestones & wishlist)
// Milestone target_date = start_date + offset_days (auto-generate)
// ═══════════════════════════════════════════════════════════

export type MilestoneStatus = 'unlocked' | 'featured' | 'locked';

export type Milestone = {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  date: string;
  xp: string;
  status: MilestoneStatus;
  emojiBg: string;
  daysLeft?: string;
  est?: string;
  specialLabel?: string;
  targetDateRaw?: string;
  offsetDays?: number;
};

export type MilestoneRow = {
  id: string;
  title: string;
  emoji: string;
  description: string | null;
  target_date: string | null;
  xp: number;
  status: string;
  created_at: string;
  offset_days: number | null;
};

export type WishlistItem = {
  id: string;
  title: string;
  desc: string;
  done: boolean;
  badge?: string;
  badgeClass?: string;
  location?: string;
  meta?: { icon: string; text: string; color?: 'primary' | 'secondary' }[];
};

export type WishlistRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  target_date: string | null;
  done: boolean;
  created_at: string;
};

// ─── Helper: hitung target_date dari start_date + offset_days ───
function calcTargetDate(startDate: string, offsetDays: number): Date {
  const start = new Date(startDate);
  const target = new Date(start);
  target.setDate(target.getDate() + offsetDays);
  return target;
}

// ─── Helper: selisih hari ───
function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Convert row Supabase → Milestone (dengan auto-calc target_date) ───
export function rowToMilestone(
  row: MilestoneRow,
  startDate: string | null
): Milestone {
  const offset = row.offset_days ?? 100;
  const now = new Date();

  // Kalau nggak ada start_date, fallback ke target_date di database
  let targetDate: Date;
  if (startDate) {
    targetDate = calcTargetDate(startDate, offset);
  } else if (row.target_date) {
    targetDate = new Date(row.target_date);
  } else {
    targetDate = new Date();
  }

  const formattedDate = targetDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Auto-detect status dari tanggal
  const isUnlocked = targetDate.getTime() <= now.getTime();
  const daysRemaining = daysBetween(now, targetDate);

  let status: MilestoneStatus = isUnlocked ? 'unlocked' : 'locked';
  let specialLabel: string | undefined;

  // Featured: kalau baru unlocked dalam 30 hari terakhir
  if (isUnlocked && daysRemaining > -30 && daysRemaining <= 0) {
    status = 'featured';
    specialLabel = 'Baru Saja Terbuka!';
  }

  return {
    id: row.id,
    emoji: row.emoji,
    title: row.title,
    desc: row.description ?? '',
    date: isUnlocked ? formattedDate : `Est. ${formattedDate}`,
    xp: isUnlocked
      ? `Unlocked +${row.xp.toLocaleString('id-ID')} XP`
      : `${Math.abs(daysRemaining).toLocaleString('id-ID')} hari tersisa`,
    status,
    emojiBg: isUnlocked ? 'bg-primary-fixed' : 'bg-surface-container-highest',
    daysLeft: !isUnlocked
      ? `${Math.abs(daysRemaining).toLocaleString('id-ID')} hari tersisa`
      : undefined,
    est: !isUnlocked ? `Est. ${formattedDate}` : undefined,
    specialLabel,
    targetDateRaw: targetDate.toISOString(),
    offsetDays: offset,
  };
}

// ─── Convert row Supabase → WishlistItem ───
export function rowToWishlist(row: WishlistRow): WishlistItem {
  return {
    id: row.id,
    title: row.title,
    desc: row.description ?? '',
    done: row.done,
    badge: row.done ? 'Selesai' : row.target_date ?? 'Rencana',
    badgeClass: row.done
      ? 'bg-secondary-fixed text-on-secondary-fixed'
      : 'bg-primary-fixed text-on-primary-fixed font-medium',
    location: row.location ?? undefined,
    meta: row.target_date
      ? [{ icon: 'event', text: row.target_date, color: 'primary' as const }]
      : undefined,
  };
}

// ─── Helper: hitung progress dari milestones + start_date ───
export function calcProgress(milestones: Milestone[], startDate?: string) {
  const unlocked = milestones.filter((m) => m.status !== 'locked').length;
  const total = milestones.length;
  const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  const next = milestones.find((m) => m.status === 'locked');

  let daysLeft = 0;
  if (next?.targetDateRaw) {
    const target = new Date(next.targetDateRaw);
    const now = new Date();
    daysLeft = Math.max(0, daysBetween(now, target));
  }

  let daysPassed = 0;
  if (startDate) {
    const start = new Date(startDate);
    const now = new Date();
    daysPassed = Math.max(0, daysBetween(start, now));
  }

  return {
    nextTitle: next?.title ?? 'Milestone Berikutnya',
    daysLeft,
    percent,
    daysPassed: daysPassed.toLocaleString('id-ID'),
    currentLabel: `${unlocked} dari ${total} terbuka`,
    nextLabel: next?.date ?? '',
  };
}
