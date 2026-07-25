export default function FormField({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#333]">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#333] outline-none transition-colors focus:border-primary placeholder:text-gray-400";
