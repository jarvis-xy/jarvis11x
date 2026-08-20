import Link from "next/link";
import { SiteLogo } from "@/components/SiteLogo";
import { XHandleLink } from "@/components/XHandleLink";
import { CATALOG } from "@/lib/catalog";
import { XPRICE_PATH, XPRICE_URL, xpriceMetadata } from "@/lib/site";

export const metadata = {
  ...xpriceMetadata(`${XPRICE_URL}/methodology`),
  title: "方法与口径 · XPrice",
};

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-cream">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber">Methodology</p>
      <h1 className="mt-2 flex items-center gap-3 font-display text-4xl">
        <SiteLogo className="h-9 w-9" />
        方法与口径
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-mute">
        <p>
          本站数据由 <XHandleLink className="text-amber" /> 整理。页面展示的是各国 Web 标价及公开中间价折算，不是收银台实时价。如有误差，请以官方为准。
        </p>
        <p>
          美元与人民币由公开中间价折算，汇率日期显示在首页。部分市场的排名会随汇率变动，即使本币标价没有变化。数据整理日期{" "}
          {CATALOG.generatedAt.slice(0, 10)}。
        </p>
        <p>
          完整标价表列出所有已收录、有 Web 标价的市场。折算后与美国 Web 标价相同的市场（含本地化标价）合并为一行，默认折叠，点击后展开。美价折扣以美国同一档位、同一付费周期的 Web 标价为基准：当地折算美元价 ÷ 美国价 − 1。负数为低于美价，正数为高于美价。美国行为基准。
        </p>
        <p>未计入增值税、销售税和支付渠道手续费，因此展示金额可能与实际应付不一致。本站为网页标价。iOS / Android 因应用商店抽成，通常更高。</p>
        <p>
          XPrice 与 X Corp. 无关联。本站仅供浏览参考，不构成购买建议，也不提供换区、虚拟账单地址、礼品卡或代订。某市场标价更低，只表示该市场的整理标价，不表示你可以按该价格在其他地区购买。
        </p>
      </div>
      <p className="mt-8">
        <Link className="text-amber" href={XPRICE_PATH}>
          返回地图
        </Link>
        <span className="mx-2 text-rule">·</span>
        <XHandleLink className="text-amber" />
      </p>
    </main>
  );
}
