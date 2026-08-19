const PROFILE_URL = "https://x.com/jarvis11x";
const HANDLE = "@jarvis11x";

export function XHandleLink({ className = "text-amber hover:text-cream" }: { className?: string }) {
  return (
    <a
      href={PROFILE_URL}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 align-baseline ${className}`}
    >
      <XLogo />
      {HANDLE}
    </a>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.725-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
