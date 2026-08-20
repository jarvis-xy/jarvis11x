"use client";

import { LOCALE_OPTIONS } from "@/lib/i18n";
import { useLocale } from "@/components/LocaleProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="flex flex-wrap border border-rule" role="group" aria-label={t("language")}>
      {LOCALE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === locale}
          className={`px-2.5 py-1.5 text-sm ${
            option.value === locale ? "bg-amber text-white" : "bg-white text-cream hover:bg-raised"
          }`}
          onClick={() => setLocale(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
