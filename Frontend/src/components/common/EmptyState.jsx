export default function EmptyState({ message = "Henüz içerik eklenmedi." }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-surface py-10 text-center text-sm text-gray-400">
      {message}
    </div>
  );
}
