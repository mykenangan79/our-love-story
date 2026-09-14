// ═══════════════════════════════════════════════════════════
// TYPES + HELPER — data dari Supabase (tabel: photos)
// ═══════════════════════════════════════════════════════════

export type Photo = {
  id: string;
  title: string;
  caption: string | null;
  image: string;
  date: string;
  aspect: '4/5' | '3/4' | '1/1' | '9/16';
  tags: string[];
  likes: number;
  category: string;
  featured: boolean;
  location?: string;
  year?: string;
  stampBadge?: string;
  tapeColor?: 'amber' | 'pink';
};

export type PhotoRow = {
  id: string;
  title: string;
  caption: string | null;
  date: string | null;
  category: string;
  tags: string[];
  photo_url: string;
  featured: boolean;
  likes: number;
  is_public: boolean;
  created_at: string;
};

// Filter kategori untuk pills
export const CATEGORY_FILTERS = [
  { id: 'all', label: '✨ Semua' },
  { id: 'Jalan-jalan', label: '✈️ Jalan-jalan' },
  { id: 'Cafe', label: '☕ Cafe & Kuliner' },
  { id: 'Candid', label: '📸 Candid Random' },
  { id: 'Spesial', label: '🎉 Momen Spesial' },
] as const;

// Aspect ratios untuk variasi
const ASPECTS: Photo['aspect'][] = ['4/5', '3/4', '1/1', '9/16'];

// Helper: convert row Supabase → Photo
export function rowToPhoto(row: PhotoRow, index: number): Photo {
  const dateObj = row.date ? new Date(row.date) : null;
  const formattedDate = dateObj
    ? `${String(dateObj.getDate()).padStart(2, '0')}.${String(
        dateObj.getMonth() + 1
      ).padStart(2, '0')}.${dateObj.getFullYear()}`
    : '';

  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    image: row.photo_url,
    date: formattedDate,
    aspect: ASPECTS[index % ASPECTS.length],
    tags: row.tags || [],
    likes: row.likes,
    category: row.category,
    featured: row.featured,
    year: dateObj ? String(dateObj.getFullYear()) : undefined,
    location: row.category,
    tapeColor: row.featured ? 'amber' : index % 3 === 0 ? 'pink' : undefined,
    stampBadge: row.featured ? 'Featured ⭐' : undefined,
  };
}
