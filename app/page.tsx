import { LaboratoriosGallery } from './laboratorios-gallery';
import { FacultyVideo } from './faculty-video';
import { laboratorios } from '@/lib/laboratorios';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top,_#eaf5ff,_transparent_55%),linear-gradient(135deg,_#f8fbff,_#fff)] px-4 py-12 sm:px-8 md:py-20">
      <section className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[var(--secondary)]">FIEE UNCP</p>
        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-[var(--primary)] sm:text-6xl">Laboratorios FIEE UNCP</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Explora los espacios de formación, investigación e innovación de la Facultad de Ingeniería Eléctrica.</p>
        <div className="mt-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-xl">
          <div className="aspect-video w-full bg-slate-100">
            <FacultyVideo />
          </div>
        </div>
        <div className="mt-12 w-full"><LaboratoriosGallery laboratorios={laboratorios} /></div>
      </section>
    </div>
  );
}
