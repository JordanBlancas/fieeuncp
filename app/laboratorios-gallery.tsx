'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog';
import type { Laboratorio } from '@/lib/laboratorios';

type GalleryImage = { id: string; name: string; src: string };

function PhotoViewer({
  selected,
  images,
  activeImage,
  activeIndex,
  loading,
  configured,
  move,
  setActiveIndex
}: {
  selected: Laboratorio;
  images: GalleryImage[];
  activeImage?: GalleryImage;
  activeIndex: number;
  loading: boolean;
  configured: boolean;
  move: (direction: number) => void;
  setActiveIndex: (index: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-xl">
      <div className="border-b border-[var(--border)] px-5 py-4 sm:px-8">
        <h2 className="text-xl font-bold text-[var(--primary)] sm:text-2xl">{selected.name}</h2>
      </div>
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {loading ? <p className="absolute inset-0 grid place-items-center text-slate-500">Cargando imágenes...</p> : activeImage ? <img src={activeImage.src} alt={activeImage.name} className="h-full w-full object-cover" /> : <div className="absolute inset-0 grid place-items-center p-8 text-center text-slate-500">{configured ? 'Esta carpeta no contiene imágenes visibles.' : 'Configura GOOGLE_DRIVE_API_KEY para cargar automáticamente las imágenes de Drive.'}</div>}
        {images.length > 1 && <><button type="button" aria-label="Imagen anterior" onClick={() => move(-1)} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl shadow">‹</button><button type="button" aria-label="Imagen siguiente" onClick={() => move(1)} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl shadow">›</button></>}
      </div>
      {images.length > 1 && <div className="flex justify-center gap-2 p-4">{images.map((image, index) => <button key={image.id} type="button" aria-label={`Ver imagen ${index + 1}`} onClick={() => setActiveIndex(index)} className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-[var(--primary)]' : 'w-2 bg-slate-300'}`} />)}</div>}
    </div>
  );
}

export function LaboratoriosGallery({ laboratorios }: { laboratorios: Laboratorio[] }) {
  const [selected, setSelected] = useState(laboratorios[0]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [mobileViewerOpen, setMobileViewerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setActiveIndex(0);
    fetch(`/api/laboratorios/${selected.slug}`)
      .then((response) => response.json())
      .then((data: { images?: GalleryImage[]; configured?: boolean }) => {
        if (!cancelled) {
          setImages(data.images ?? []);
          setConfigured(data.configured ?? false);
        }
      })
      .catch(() => { if (!cancelled) setImages([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selected]);

  const activeImage = images[activeIndex];
  const move = (direction: number) => setActiveIndex((index) => (index + direction + images.length) % images.length);
  const resetMobileViewer = (open: boolean) => {
    setMobileViewerOpen(open);
    if (!open) {
      setSelected(laboratorios[0]);
    }
  };

  return (
    <section className="w-full max-w-6xl" aria-label="Galería de laboratorios">
      <div className="hidden flex-wrap justify-center gap-3 md:flex">
        {laboratorios.map((laboratorio) => (
          <button key={laboratorio.slug} type="button" onClick={() => setSelected(laboratorio)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selected.slug === laboratorio.slug ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-md' : 'border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]'}`}>
            {laboratorio.name}
          </button>
        ))}
      </div>

      <div className="mt-10 hidden md:block">
        <PhotoViewer selected={selected} images={images} activeImage={activeImage} activeIndex={activeIndex} loading={loading} configured={configured} move={move} setActiveIndex={setActiveIndex} />
      </div>

      <div className="flex flex-wrap justify-center gap-3 md:hidden">
        {laboratorios.map((laboratorio) => (
          <button key={laboratorio.slug} type="button" onClick={() => { setSelected(laboratorio); setMobileViewerOpen(true); }} className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">
            {laboratorio.name}
          </button>
        ))}
      </div>

      <Dialog open={mobileViewerOpen} onOpenChange={resetMobileViewer}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-2xl">
          <DialogTitle className="sr-only">Galería de {selected.name}</DialogTitle>
          <PhotoViewer selected={selected} images={images} activeImage={activeImage} activeIndex={activeIndex} loading={loading} configured={configured} move={move} setActiveIndex={setActiveIndex} />
        </DialogContent>
      </Dialog>
    </section>
  );
}