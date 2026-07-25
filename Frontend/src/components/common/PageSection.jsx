export default function PageSection({ children, className = "" }) {
  return <section className={`mx-auto max-w-7xl px-4 py-10 ${className}`}>{children}</section>;
}
