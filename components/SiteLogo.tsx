export function SiteLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#1c1917" />
      <path
        fill="#c05621"
        d="M6.2 8.3h3.05L12.2 13.6l2.95-5.3H18.2L13.55 16.1 18.4 23.7h-3.15L12.2 18.5 9.1 23.7H6.05l4.75-7.6z"
      />
      <path
        fill="#c05621"
        d="M19.2 8.3h4.35c2.55 0 4.25 1.45 4.25 3.85 0 2.35-1.7 3.8-4.25 3.8H21.4V23.7h-2.2zm2.2 2.05v3.55h2.05c1.25 0 2.05-.7 2.05-1.78 0-1.06-.8-1.77-2.05-1.77z"
      />
    </svg>
  );
}
