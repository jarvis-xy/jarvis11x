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

export function XBylineBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href={PROFILE_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="by @jarvis11x"
      className={`inline-flex items-center gap-0.5 font-mono text-[10px] leading-none tracking-wide text-mute hover:text-amber ${className}`}
    >
      by
      <XLogo className="h-2.5 w-2.5" />
      @jarvis11x
    </a>
  );
}

function XLogo({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-current`}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.725-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
