export default function SectionTitle({ title, action }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-primary md:text-3xl">{title}</h2>
      {action}
    </div>
  );
}
