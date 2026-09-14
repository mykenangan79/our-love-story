// TYPES — data dari Supabase (tabel: settings)

export type Settings = {
  id: number;
  couple_names: string;
  start_date: string;
  badge_text: string;
  bio: string;
  hero_photo_url: string | null;
  hero_photo_date?: string;
  hero_photo_caption?: string;
  hero_photo_subtitle?: string;
  place: string;
  song_title: string;
  song_url: string | null;
  song_type?: 'youtube' | 'mp3' | 'none' | null;
  updated_at: string;
};
