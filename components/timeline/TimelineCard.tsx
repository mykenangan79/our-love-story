'use client';
import { useState } from 'react';
import { Chapter } from '@/lib/timeline-data';

export default function TimelineCard({ chapter }: { chapter: Chapter }) {
  const [reactions, setReactions] = useState(chapter.reactions);

  const handleReact = (idx: number) => {
    setReactions((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, count: r.count + 1 } : r))
    );
  };

  const isLeft = chapter.position === 'left';

  return (
    <div
      className="timeline-item flex flex-col md:flex-row items-center w-full gap-space-md relative"
      data-category={chapter.category}
    >
      <div
        className={`w-full md:w-1/2 flex justify-start pl-12 md:pl-0 ${
          isLeft ? 'md:pr-space-xl md:justify-end' : 'md:pl-space-xl md:order-2'
        }`}
      >
        <div
          className={`w-full max-w-lg p-space-lg rounded-xl backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
            chapter.isMilestoneBig
              ? 'bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-space-xl'
              : 'bg-surface-container-lowest/90'
          }`}
        >
          {chapter.isMilestoneBig && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/30 rounded-full blur-2xl pointer-events-none" />
          )}

          {/* Header row */}
          <div className="flex items-center gap-1.5 flex-wrap mb-space-sm">
            <span className={`px-space-sm py-0.5 rounded-full font-label-sm text-label-sm ${chapter.badgeClass}`}>
              {chapter.badge}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {chapter.date}
            </span>
          </div>

          <h2
            className={`${
              chapter.isMilestoneBig
                ? 'font-headline-lg text-headline-lg'
                : 'font-headline-md text-headline-md'
            } text-primary mb-1`}
          >
            {chapter.title}
          </h2>

          <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md mb-space-sm">
            <span className="material-symbols-outlined text-[16px] text-primary">
              {chapter.locationIcon}
            </span>
            <span>{chapter.location}</span>
          </div>

          {chapter.story && (
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
              {chapter.story}
            </p>
          )}

          {chapter.polaroid && (
            <div className="p-space-md bg-surface-container-lowest/80 rounded-xl shadow-sm mb-space-md transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="relative bg-surface-container-high/40 p-2 rounded-lg pb-5 shadow-inner">
                <img className="w-full h-56 object-cover rounded" alt={chapter.title} src={chapter.polaroid.image} />
                <div className="text-center font-display-lg text-xs italic text-on-surface mt-2">
                  {chapter.polaroid.caption}
                </div>
              </div>
            </div>
          )}

          {chapter.quote && (
            <div className="p-space-md rounded-xl bg-surface-container-high/60 backdrop-blur-md mb-space-md">
              <p className="font-body-md text-body-md text-on-surface italic leading-relaxed">
                {chapter.quote}
              </p>
            </div>
          )}

          {chapter.voiceNote && (
            <div className="p-space-sm rounded-full bg-surface-container-high/60 backdrop-blur-sm flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-xs">
                <button className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                </button>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-semibold text-primary">
                    {chapter.voiceNote.title}
                  </span>
                  <span className="font-body-md text-xs text-on-surface-variant">
                    {chapter.voiceNote.text} ({chapter.voiceNote.duration})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 h-3 pr-2">
                <span className="w-0.5 bg-primary/80 rounded-full h-2" />
                <span className="w-0.5 bg-primary rounded-full h-3" />
                <span className="w-0.5 bg-primary/60 rounded-full h-1.5" />
                <span className="w-0.5 bg-primary rounded-full h-2.5" />
              </div>
            </div>
          )}

          {chapter.photos && !chapter.polaroid && (
            chapter.photos.length === 1 ? (
              <div className="rounded-lg overflow-hidden mb-space-md shadow-sm">
                <img className="w-full h-44 object-cover" alt={chapter.title} src={chapter.photos[0]} />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-space-xs mb-space-md">
                {chapter.photos.map((p, i) => (
                  <div key={i} className="h-28 rounded-lg overflow-hidden shadow-sm">
                    <img className="w-full h-full object-cover" alt="" src={p} />
                  </div>
                ))}
              </div>
            )
          )}

          {/* Reactions */}
          <div className="flex items-center gap-space-xs pt-space-xs flex-wrap">
            {reactions.map((r, i) => (
              <button
                key={i}
                onClick={() => handleReact(i)}
                className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 transition-all active:scale-95 ${
                  chapter.isMilestoneBig && i === 0
                    ? 'bg-primary-fixed text-on-primary-fixed shadow-sm px-space-md py-1.5'
                    : 'bg-surface-container-low hover:bg-primary-fixed-dim/40 text-on-surface'
                }`}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center icon */}
      <div
        className={`absolute left-6 md:left-1/2 -translate-x-1/2 rounded-full shadow-md flex items-center justify-center z-10 ring-4 ring-background ${
          chapter.isMilestoneBig
            ? 'w-14 h-14 bg-gradient-to-tr from-primary to-primary-container text-on-primary ring-primary-fixed shadow-xl z-20'
            : 'w-12 h-12 bg-surface-container-lowest text-primary'
        }`}
      >
        <span className={chapter.isMilestoneBig ? 'text-2xl animate-pulse' : 'text-xl'}>
          {chapter.emoji}
        </span>
      </div>

      {/* Side note */}
      <div
        className={`hidden md:block w-1/2 ${
          isLeft ? 'pl-space-xl' : 'pr-space-xl text-right md:order-1'
        }`}
      >
        {chapter.sideTitle ? (
          <>
            <div className="text-primary font-headline-sm text-headline-sm font-semibold">
              {chapter.sideTitle}
            </div>
            <p className="text-on-surface-variant font-body-md text-body-md max-w-sm mt-1">
              {chapter.sideDesc}
            </p>
          </>
        ) : (
          <div className="text-on-surface-variant font-label-md text-label-md italic opacity-70">
            {chapter.sideNote}
          </div>
        )}
      </div>
    </div>
  );
}
