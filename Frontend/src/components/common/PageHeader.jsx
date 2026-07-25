export default function PageHeader({ title, subtitle }) {
  return (
    <section className="mx-auto mt-8 max-w-7xl px-4">
      <div className="rounded-3xl bg-gradient-to-br from-primary via-primary-light to-primary-dark px-8 py-14 text-center shadow-lg md:py-20">
        <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 md:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}
