import { Link } from "react-router-dom";

export default function ShowMoreButton({ to, children = "Göster" }) {
  return (
    <Link
      to={to}
      className="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
    >
      {children}
    </Link>
  );
}
