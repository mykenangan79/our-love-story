// TYPES + HELPER — data dari Supabase (tabel: letters)

export type Letter = {
  id: string;
  variant: 'opened' | 'sealed' | 'notebook' | 'sticky';
  from: string;
  to: string;
  title: string;
  date: string;
  location: string;
  authorInitial: string;
  authorAvatar: string;
  authorBadgeClass: string;
  category: string; // ← dinamis dari author
  quote: string;
  body?: string;
  signature?: string;
  likes?: number;
  readCount?: number;
  attachment?: { image: string; title: string; caption: string };
  voiceNote?: { label: string; duration: string };
  checklist?: string[];
  lockedDays?: number;
  lockedMonths?: number;
  lockedUntil?: string;
  span?: string;
};

export type LetterRow = {
  id: string;
  title: string;
  content: string;
  author: string;
  type: string;
  tags: string[];
  is_sealed: boolean;
  unlock_date: string | null;
  views: number;
  created_at: string;
};

// Quotes di-fetch dari Supabase (sweet_quotes), bukan hardcoded
export const letterStats = {
  total: 0,
  locked: 0,
  days: '0',
};

export function rowToLetter(row: LetterRow, index: number): Letter {
  const authorLower = (row.author || '').toLowerCase();
  const isKevin = authorLower.includes('kevin');

  // Category = author name (untuk filter tab dinamis)
  const category = row.is_sealed ? 'sealed' : row.author;

  const dateObj = new Date(row.created_at);
  const formattedDate = dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  let variant: Letter['variant'] = 'opened';
  if (row.is_sealed) variant = 'sealed';
  else if (row.type === 'Sticky Note') variant = 'sticky';
  else if (index % 4 === 3) variant = 'notebook';

  const initial = row.author.charAt(0).toUpperCase();

  const authorAvatar =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(row.author)}&background=874e58&color=fff&size=200`;

  const authorBadgeClass = row.is_sealed
    ? 'bg-tertiary-container text-tertiary'
    : isKevin
    ? 'bg-primary-fixed-dim/70 text-primary'
    : 'bg-secondary-fixed-dim/70 text-secondary';

  const spans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-6', 'md:col-span-6'];
  const span = spans[index % spans.length];

  return {
    id: row.id,
    variant,
    from: row.author,
    to: '', // dinamis — tidak perlu "to" hardcoded
    title: row.title,
    date: formattedDate,
    location: row.tags[0] ?? '',
    authorInitial: initial,
    authorAvatar,
    authorBadgeClass,
    category,
    quote: row.content,
    signature: `Dengan cinta, ${row.author}`,
    likes: 0,
    readCount: row.views || undefined,
    lockedUntil: row.is_sealed ? 'Baru bisa dibuka saat tanggal pernikahan tiba' : undefined,
    lockedDays: row.is_sealed ? 241 : undefined,
    lockedMonths: row.is_sealed ? 6 : undefined,
    span,
  };
}
