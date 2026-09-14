'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Song = {
  id: string;
  title: string;
  url: string;
  type: 'youtube' | 'mp3';
  order_index: number;
  is_autoplay: boolean;
};

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

export default function MusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true); // ← mulai muted biar autoplay jalan

  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch songs
  useEffect(() => {
    async function fetchSongs() {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        const songList = data as Song[];
        setSongs(songList);
        const autoIdx = songList.findIndex((s) => s.is_autoplay);
        if (autoIdx !== -1) setCurrentIdx(autoIdx);
      }
      setLoading(false);
    }
    fetchSongs();
  }, []);

  // Listener global: setiap klik/scroll pertama → unmute
  useEffect(() => {
    const handleFirstInteraction = () => {
      setMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
      // Remove listener setelah sekali
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Sync mute ke MP3 audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
      if (playing) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [muted, playing, currentIdx]);

  const currentSong = songs[currentIdx];
  const youtubeId =
    currentSong?.type === 'youtube' ? getYouTubeId(currentSong.url) : null;

  const next = () => {
    if (songs.length === 0) return;
    setCurrentIdx((i) => (i + 1) % songs.length);
  };

  const prev = () => {
    if (songs.length === 0) return;
    setCurrentIdx((i) => (i - 1 + songs.length) % songs.length);
  };

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const selectSong = (idx: number) => {
    setCurrentIdx(idx);
    setPlaying(true);
    setShowList(false);
  };

  if (loading || songs.length === 0) return null;

  // ═══ MINIMIZED — tombol bulat kecil ═══
  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary shadow-xl hover:scale-110 transition-all flex items-center justify-center"
        title="Buka Music Player"
      >
        <span className="material-symbols-outlined text-[26px]">
          {playing ? (muted ? 'music_off' : 'graphic_eq') : 'music_note'}
        </span>
        {playing && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <>
      {/* Compact Bar — KECIL, selalu kelihatan */}
      <aside className="fixed bottom-6 left-6 z-40 max-w-sm hidden sm:flex items-center gap-3 p-2 rounded-full bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_12px_32px_-4px_rgba(92,46,62,0.12),0_4px_12px_-2px_rgba(255,154,158,0.18)] transition-all duration-300 hover:scale-[1.02]">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">
            {playing ? 'pause' : 'play_arrow'}
          </span>
        </button>

        {/* Info */}
        <div className="flex flex-col pr-2 min-w-0">
          <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">
            {muted ? '🔇 Muted' : '🎵 Our Song'} {songs.length > 1 ? `• ${currentIdx + 1}/${songs.length}` : ''}
          </span>
          <span className="text-xs font-medium text-on-surface truncate max-w-[150px]">
            {currentSong?.title || 'Loading...'}
          </span>
        </div>

        {/* Wave */}
        <div className="flex items-center gap-0.5 h-4 px-1">
          <span className={`w-0.5 bg-primary rounded-full sound-wave-bar h-2 ${!playing || muted ? 'opacity-30' : ''}`} />
          <span className={`w-0.5 bg-primary rounded-full sound-wave-bar h-3.5 ${!playing || muted ? 'opacity-30' : ''}`} style={{ animationDelay: '0.2s' }} />
          <span className={`w-0.5 bg-primary rounded-full sound-wave-bar h-1.5 ${!playing || muted ? 'opacity-30' : ''}`} style={{ animationDelay: '0.4s' }} />
          <span className={`w-0.5 bg-primary rounded-full sound-wave-bar h-4 ${!playing || muted ? 'opacity-30' : ''}`} style={{ animationDelay: '0.1s' }} />
        </div>

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-full text-primary hover:bg-primary-fixed transition-colors"
          title={muted ? 'Unmute' : 'Mute'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {muted ? 'volume_off' : 'volume_up'}
          </span>
        </button>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-full text-primary hover:bg-primary-fixed transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            {expanded ? 'expand_more' : 'expand_less'}
          </span>
        </button>
      </aside>

      {/* Expanded Player */}
      {expanded && (
        <div className="fixed bottom-24 left-6 z-40 max-w-md w-[420px] rounded-2xl bg-surface-container-lowest/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary shrink-0">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>music_note</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider">
                  Now Playing {currentIdx + 1}/{songs.length}
                </span>
                <span className="text-sm text-on-surface font-semibold truncate">
                  {currentSong?.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowList(!showList)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  showList ? 'text-primary bg-primary-fixed' : 'text-outline hover:bg-surface-container-high'
                }`}
                title="Playlist"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>queue_music</span>
              </button>
              <button
                onClick={() => {
                  setExpanded(false);
                  setMinimized(true);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:bg-surface-container-high"
                title="Minimize"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
          </div>

          {!showList ? (
            <>
              {/* Banner Unmute */}
              {muted && (
                <div className="mx-4 mt-4 p-3 rounded-xl bg-primary-fixed/40 border border-primary/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>volume_off</span>
                    <span className="text-xs text-on-surface font-medium">
                      Musik sedang diputar tanpa suara
                    </span>
                  </div>
                  <button
                    onClick={toggleMute}
                    className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-medium hover:bg-primary-container transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>volume_up</span>
                    <span>Unmute</span>
                  </button>
                </div>
              )}

              <div className="p-4">
                {currentSong?.type === 'youtube' && youtubeId && playing ? (
                  <div className="aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=1&mute=${muted ? 1 : 0}`}
                      title={currentSong.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : currentSong?.type === 'mp3' ? (
                  <audio
                    ref={audioRef}
                    controls
                    autoPlay
                    muted={muted}
                    src={currentSong.url}
                    onEnded={next}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    className="w-full"
                  />
                ) : (
                  <div className="aspect-video rounded-xl bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary/40" style={{ fontSize: 64 }}>music_note</span>
                  </div>
                )}
              </div>

              <div className="px-4 pb-4 flex items-center justify-center gap-3">
                <button onClick={prev} disabled={songs.length <= 1} className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-primary-fixed disabled:opacity-30">
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>skip_previous</span>
                </button>
                <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-md hover:scale-105 transition-all">
                  <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                    {playing ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <button onClick={next} disabled={songs.length <= 1} className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-primary-fixed disabled:opacity-30">
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>skip_next</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Playlist ({songs.length} lagu)
                </span>
                <button onClick={() => setShowList(false)} className="text-xs text-primary hover:underline">
                  Kembali
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {songs.map((song, idx) => {
                  const songYtId = song.type === 'youtube' ? getYouTubeId(song.url) : null;
                  const isActive = idx === currentIdx;

                  return (
                    <button
                      key={song.id}
                      onClick={() => selectSong(idx)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                        isActive ? 'bg-primary-fixed/60 border border-primary/30' : 'hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0 flex items-center justify-center">
                        {songYtId ? (
                          <img src={`https://img.youtube.com/vi/${songYtId}/default.jpg`} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>music_note</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium truncate block ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                          {song.title}
                        </span>
                        <span className="text-[10px] uppercase text-on-surface-variant">{song.type}</span>
                      </div>
                      {isActive && (
                        <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 20 }}>
                          {playing ? 'graphic_eq' : 'pause'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
