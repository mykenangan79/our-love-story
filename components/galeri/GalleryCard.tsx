'use client';
import { useState } from 'react';
import { Photo } from '@/lib/gallery-data';

export default function GalleryCard({ photo }: { photo: Photo }) {
  const [likes, setLikes] = useState(photo.likes);
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const aspectClass = {
    '4/5': 'aspect-[4/5]',
    '3/4': 'aspect-[3/4]',
    '1/1': 'aspect-square',
    '9/16': 'aspect-[9/16]',
  }[photo.aspect];

  const tapeColor = photo.tapeColor === 'pink' ? 'bg-pink-100/80 border-pink-200/50' : 'bg-amber-100/80 border-amber-200/50';

  return (
    <div className="break-inside-avoid group relative rounded-2xl bg-surface-container-lowest/90 backdrop-blur-md p-4 shadow-[0_10px_26px_-4px_rgba(92,46,62,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      {/* Washi tape — top-left + top-right (featured) */}
      {photo.featured && (
        <>
          <div className={`absolute -top-3 left-6 w-16 h-7 ${tapeColor} backdrop-blur-xs -rotate-6 shadow-sm border-b z-20 pointer-events-none`} />
          <div className={`absolute -top-3 right-6 w-16 h-7 ${tapeColor} backdrop-blur-xs rotate-6 shadow-sm border-b z-20 pointer-events-none`} />
        </>
      )}

      {/* Washi tape — top-center (cafe) */}
      {photo.tapeColor === 'pink' && !photo.featured && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 ${tapeColor} backdrop-blur-xs rotate-1 shadow-sm border-b z-20 pointer-events-none`} />
      )}

      {/* Stamp badge */}
      {photo.stampBadge && (
        <div className="absolute -top-2.5 right-6 px-3 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-[10px] font-semibold tracking-wider shadow-sm z-20">
          {photo.stampBadge}
        </div>
      )}

      {/* Photo */}
      <div className={`relative overflow-hidden rounded-xl bg-surface-container ${aspectClass} w-full`}>
        <img
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          alt={photo.title}
          src={photo.image}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          <div className="flex justify-between items-center">
            {photo.featured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 text-primary font-label-sm font-semibold shadow-sm">
                <span className="material-symbols-outlined text-[14px]">push_pin</span>
                Featured
              </span>
            ) : (
              <span />
            )}
          </div>
          <div className="flex justify-between items-end text-on-primary">
            <span className="font-label-sm tracking-wider opacity-90">
              {photo.location || 'Sweet Moment'}
            </span>
          </div>
        </div>

        {/* Date stamp */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-inverse-surface/60 backdrop-blur-sm text-surface-bright font-label-sm tracking-widest text-[10px] pointer-events-none">
          {photo.date}
        </div>
      </div>

      {/* Caption */}
      <div className="pt-4 pb-2 px-1 flex flex-col gap-2">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold leading-snug">
            {photo.title}
          </h3>
          <p className="font-body-md text-on-surface-variant text-xs mt-0.5">
            {photo.caption}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {photo.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px]"
              >
                {t}
              </span>
            ))}
          </div>
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors active:scale-95 ${
              liked
                ? 'bg-primary-fixed text-on-primary-fixed-variant'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span className="font-label-md font-bold text-xs">{likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
