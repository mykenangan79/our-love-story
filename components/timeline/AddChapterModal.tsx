'use client';

export default function AddChapterModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-space-md"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">
              bookmark_add
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Tulis Babak Baru
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form
          className="space-y-space-md"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-1">
              Judul Babak
            </label>
            <input
              className="w-full px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              placeholder="Misal: Piknik Pertama di Kebun Raya"
              type="text"
            />
          </div>
          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-1">
                Tanggal
              </label>
              <input
                className="w-full px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                type="date"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-1">
                Kategori
              </label>
              <select className="w-full px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner">
                <option value="kencan">Kencan</option>
                <option value="liburan">Liburan</option>
                <option value="milestone">Milestone Penting</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-1">
              Lokasi
            </label>
            <input
              className="w-full px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              placeholder="Misal: Bandung, Jawa Barat"
              type="text"
            />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-1">
              Cerita Manis
            </label>
            <textarea
              className="w-full px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              placeholder="Ceritakan apa yang membuat hari itu tak terlupakan..."
              rows={3}
            />
          </div>
          <div className="flex items-center justify-end gap-space-sm pt-space-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-space-md py-2 rounded-full text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-space-lg py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-md text-label-md shadow-md hover:shadow-lg transition-all"
            >
              Simpan Momen 💖
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
