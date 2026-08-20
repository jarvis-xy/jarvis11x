"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { LOCALE_OPTIONS } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("language")}
        className="border border-rule bg-white px-3 py-2 text-sm text-cream hover:bg-raised"
        onClick={() => setOpen((value) => !value)}
      >
        {LOCALE_OPTIONS.find((option) => option.value === locale)?.label ?? locale}
        <span className="ml-1.5 font-mono text-amber">{open ? "▴" : "▾"}</span>
      </button>
      {open ? (
        <ul role="listbox" className="absolute right-0 z-30 mt-1 min-w-[9.5rem] border border-rule bg-panel shadow-sm">
          {LOCALE_OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === locale}
                className={`flex w-full px-3 py-2 text-left text-sm ${
                  option.value === locale ? "bg-amber text-white" : "text-cream hover:bg-raised"
                }`}
                onClick={() => {
                  setLocale(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
