export default function Footer({
  coupleNames,
  startDate,
}: {
  coupleNames?: string;
  startDate?: string;
}) {
  const namesLabel = coupleNames || 'Our Love Story';

  const sinceLabel = startDate
    ? new Date(startDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <footer className="w-full bg-surface-container-low/70 backdrop-blur-lg pt-12 pb-10 relative z-20">
      <div className="w-full px-gutter lg:px-margin flex flex-col md:flex-row items-center justify-between gap-space-lg text-center md:text-left">
        <div className="flex flex-col gap-1">
          <p className="font-headline-sm text-headline-sm text-primary">{namesLabel}</p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Made with ❤️{sinceLabel ? ` • Sejak ${sinceLabel}` : ''} — dan terus bertambah setiap hari.
          </p>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary">
              auto_awesome
            </span>
            <span>Ruang Kenangan Abadi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
