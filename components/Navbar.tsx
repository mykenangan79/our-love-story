'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { path: '/', label: 'Beranda', icon: 'home' },
  { path: '/timeline', label: 'Timeline', icon: 'auto_stories' },
  { path: '/galeri', label: 'Galeri', icon: 'photo_library' },
  { path: '/surat-cinta', label: 'Surat Cinta', icon: 'mail' },
  { path: '/milestones', label: 'Milestones', icon: 'workspace_premium' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* ═══ TOP NAVBAR (semua device) ═══ */}
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(135,78,88,0.06)]">
        <div className="h-16 lg:h-20 w-full px-gutter lg:px-margin flex items-center justify-between gap-gutter">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-space-sm shrink-0">
            <span
              className="material-symbols-outlined text-primary text-[24px] lg:text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span className="font-headline-md text-headline-md text-primary tracking-tight font-semibold text-base lg:text-xl">
              Our Love Story
            </span>
          </Link>

          {/* Nav Links (desktop only) */}
          <nav className="hidden xl:flex items-center gap-space-xs p-1 rounded-full bg-surface-container-low/70 backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all duration-200 ${
                    active
                      ? 'bg-primary-container text-on-primary-container font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search (desktop only) */}
          <div className="flex items-center gap-space-sm">
            <div className="relative hidden sm:block w-44 lg:w-56">
              <input
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-surface-container-lowest/80 text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-xs focus:outline-none focus:ring-2 focus:ring-primary-container shadow-[0_2px_10px_rgba(135,78,88,0.04)] transition-all"
                placeholder="Cari kenangan kita..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant/70">
                search
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ BOTTOM NAV (mobile only) ═══ */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container-high shadow-[0_-4px_20px_rgba(135,78,88,0.08)]">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.path ||
              (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
                  active ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 22,
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
