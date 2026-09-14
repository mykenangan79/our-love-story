'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import Footer from '@/components/Footer';
import GalleryCard from '@/components/galeri/GalleryCard';
import { supabase } from '@/lib/supabase';
import {
  rowToPhoto,
  CATEGORY_FILTERS,
  type Photo,
  type PhotoRow,
} from '@/lib/gallery-data';

export default function GaleriPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchPhotos() {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_public', true)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
      } else if (data) {
        const mapped = (data as PhotoRow[]).map((row, i) => rowToPhoto(row, i));
        setPhotos(mapped);
      }
      setLoading(false);
    }

    fetchPhotos();
  }, []);

  const visible =
    filter === 'all' ? photos : photos.filter((p) => p.category === filter);

  return (
    <>
      <Navbar />

      <main className="w-full pt-20 flex-1 relative z-10">
        <div className="relative w-full px-gutter-sm md:px-margin pt-6 pb-24 overflow-hidden">
          {/* Header */}
          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-space-sm mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/40 text-on-primary-container font-label-sm uppercase tracking-widest shadow-sm backdrop-blur-sm">
              <span
                className="material-symbols-outlined text-[15px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              <span>Koleksi Memori &amp; Album Scrapbook</span>
            </div>
            <h1 className="font-headline-lg md:font-display-lg text-headline-lg md:text-display-lg text-primary tracking-tight font-semibold mt-1">
              Galeri Momen Berharga
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Potongan kenangan manis yang terekam kamera dan tersimpan di hati, disusun
              dengan segenap rasa cinta.
            </p>
          </div>

          {/* Filter pills — FIX: hitung counter real */}
          <div className="max-w-5xl mx-auto w-full flex items-center justify-start md:justify-center overflow-x-auto py-3 px-2 gap-2 mb-8 scrollbar-none">
            {CATEGORY_FILTERS.map((f) => {
              const count =
                f.id === 'all'
                  ? photos.length
                  : photos.filter((p) => p.category === f.id).length;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-full font-label-md shrink-0 transition-all duration-200 ${
                    filter === f.id
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-lowest/80 text-on-surface-variant hover:bg-surface-container-high hover:text-primary shadow-sm'
                  }`}
                >
                  {f.label} ({count})
                </button>
              );
            })}
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
                Memuat galeri kenangan... 📷
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && photos.length === 0 && (
            <div className="text-center py-20 space-y-3">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: 56 }}
              >
                photo_library
              </span>
              <h3 className="font-serif text-2xl text-on-surface">Belum ada foto</h3>
              <p className="text-sm text-on-surface-variant">
                Yuk upload foto kenangan pertama kalian! 💕
              </p>
            </div>
          )}

          {/* Filtered empty */}
          {!loading && photos.length > 0 && visible.length === 0 && (
            <p className="text-center text-on-surface-variant py-12">
              Belum ada foto di kategori ini 📷
            </p>
          )}

          {/* Masonry grid */}
          {!loading && visible.length > 0 && (
            <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance] space-y-6">
              {visible.map((p) => (
                <GalleryCard key={p.id} photo={p} />
              ))}
            </div>
          )}

          {/* Load more */}
          {!loading && visible.length > 0 && (
            <div className="max-w-md mx-auto mt-16 text-center flex flex-col items-center gap-3">
              <button className="px-8 py-3 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-md shadow-sm hover:bg-surface-container-high hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  motion_photos_on
                </span>
                <span>Buka Lembaran Memori Lainnya</span>
              </button>
              <span className="font-label-sm text-[11px] text-on-surface-variant">
                Setiap detik berharga yang kita ukir selamanya
              </span>
            </div>
          )}
        </div>
      </main>

      <MusicPlayer />
      <Footer />
    </>
  );
}
