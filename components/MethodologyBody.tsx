"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/components/LocaleProvider";
import { SiteLogo } from "@/components/SiteLogo";
import { XHandleLink } from "@/components/XHandleLink";
import { CATALOG } from "@/lib/catalog";
import { XPRICE_PATH } from "@/lib/site";

export function MethodologyBody() {
  const { t } = useLocale();
  const compiled = CATALOG.generatedAt.slice(0, 10);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-cream">
      <LanguageSwitcher />
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-amber">{t("methKicker")}</p>
      <h1 className="mt-2 flex items-center gap-3 font-display text-4xl">
        <SiteLogo className="h-9 w-9" />
        {t("methTitle")}
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-mute">
        <p>
          {t("methP1Lead")} <XHandleLink className="text-amber" />
          {t("methP1Tail")}
        </p>
        <p>{t("methP2", { date: compiled })}</p>
        <p>{t("methP3")}</p>
        <p>{t("methP4")}</p>
        <p>{t("methP5")}</p>
      </div>
      <p className="mt-8">
        <Link className="text-amber" href={XPRICE_PATH}>
          {t("backToMap")}
        </Link>
        <span className="mx-2 text-rule">·</span>
        <XHandleLink className="text-amber" />
      </p>
    </main>
  );
}
