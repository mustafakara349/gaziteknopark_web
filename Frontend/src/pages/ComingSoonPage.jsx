export default function ComingSoonPage({ title }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
      <h1 className="text-2xl font-bold text-primary">{title}</h1>
      <p className="mt-3 text-sm text-gray-500">Bu sayfa yakında hizmete açılacak.</p>
    </div>
  );
}
