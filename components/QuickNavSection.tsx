'use client';

import Link from 'next/link';

const CARDS = [
  {
    path: '/timeline',
    bab: 'Bab 01',
    title: 'Timeline',
    desc: 'Cerita kita dari awal pertama temu hingga hari ini.',
    icon: 'coffee',
    iconBg: 'bg-surface-container-high text-primary',
  },
  {
    path: '/galeri',
    bab: 'Bab 02',
    title: 'Galeri Foto',
    desc: 'Koleksi tawa lepas & momen berharga berdua.',
    icon: 'photo_camera',
    iconBg: 'bg-secondary-container/60 text-on-secondary-container',
  },
  {
    path: '/surat-cinta',
    bab: 'Bab 03',
    title: 'Surat Cinta',
    desc: 'Pesan rahasia & kata manis yang tak lekang waktu.',
    icon: 'mail',
    iconBg: 'bg-tertiary-container/60 text-on-tertiary-container',
  },
  {
    path: '/milestones',
    bab: 'Bab 04',
    title: 'Milestones',
    desc: 'Jejak langkah & impian besar masa depan berdua.',
    icon: 'diamond',
    iconBg: 'bg-primary-container/60 text-on-primary-container',
  },
];

export default function QuickNavSection() {
  return (
    <section className="max-w-6xl mx-auto w-full mb-24">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-space-xs mb-8">
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
            Jelajahi Arsip Cinta
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary font-semibold">
            Ruang Berbagi Cerita
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
          Semua catatan, potret, dan janji masa depan kita tersimpan rapi di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {CARDS.map((c) => (
          <Link
            key={c.path}
            href={c.path}
            className="group p-6 rounded-3xl bg-surface-container-lowest/80 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-64 hover:-translate-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300 ${c.iconBg}`}
              >
                <span className="material-symbols-outlined text-[24px]">{c.icon}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-1 transition-all">
                arrow_forward
              </span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                {c.bab}
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-semibold mt-1">
                {c.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                {c.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}