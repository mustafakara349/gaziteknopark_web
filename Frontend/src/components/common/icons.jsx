export function SearchIcon({ style, className = "h-4 w-4", ...props }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ width: 16, height: 16, ...style }}
      className={className}
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function ChevronDownIcon({ style, className = "h-3.5 w-3.5", ...props }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 14, height: 14, ...style }}
      className={className}
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function FacebookIcon({ style, className = "h-4 w-4", ...props }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ width: 16, height: 16, ...style }}
      className={className}
      {...props}
    >
      <path d="M13.5 21v-7.5H16l.5-3H13.5V8.5c0-.9.3-1.5 1.6-1.5H16.5V4.3c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V10.5H7.5v3H10V21h3.5z" />
    </svg>
  );
}

export function InstagramIcon({ style, className = "h-4 w-4", ...props }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ width: 16, height: 16, ...style }}
      className={className}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon({ style, className = "h-4 w-4", ...props }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ width: 16, height: 16, ...style }}
      className={className}
      {...props}
    >
      <path d="M4 4l7.2 8.6L4.4 20h2.3l5.9-6.6L17.6 20H20l-7.5-9.1L19.8 4h-2.3l-5.5 6.1L8.4 4H4z" />
    </svg>
  );
}

export function LinkedinIcon({ style, className = "h-4 w-4", ...props }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ width: 16, height: 16, ...style }}
      className={className}
      {...props}
    >
      <path d="M6.94 8.5H4.06V20h2.88V8.5zM5.5 4a1.67 1.67 0 100 3.34A1.67 1.67 0 005.5 4zM20 13.4c0-3.1-1.65-4.55-3.86-4.55-1.78 0-2.57 1-3.02 1.7V8.5H10.2c.04.9 0 12 0 12h2.92v-6.7c0-.36.03-.72.13-.98.29-.72.95-1.47 2.06-1.47 1.45 0 2.03 1.1 2.03 2.72V20H20v-6.6z" />
    </svg>
  );
}

export function socialIcon(name) {
  const key = name?.toLowerCase() ?? "";
  if (key.includes("facebook")) return FacebookIcon;
  if (key.includes("instagram")) return InstagramIcon;
  if (key.includes("x") || key.includes("twitter")) return XIcon;
  if (key.includes("linkedin")) return LinkedinIcon;
  return FacebookIcon;
}
