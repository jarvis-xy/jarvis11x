import Link from "next/link";
import { CATALOG } from "@/lib/catalog";

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-cream">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber">Methodology</p>
      <h1 className="mt-2 font-display text-4xl">方法与口径</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-mute">
        <p>
          本币价格来自{" "}
          <a className="text-amber" href={CATALOG.source.url} rel="noreferrer" target="_blank">
            X 帮助中心 About X Premium
          </a>
          的公开 Web 价目表。官方价目表更新日期 {CATALOG.source.officialUpdatedAt}，本站收录 {CATALOG.generatedAt.slice(0, 10)}。这是帮助页上的标价，不是收银台实时价。
        </p>
        <p>
          美元与人民币由公开中间价折算，汇率日期显示在首页。土耳其、尼日利亚、埃及等市场的排名会随汇率变动，即使 X 没有改本币价。
        </p>
        <p>
          大量国家使用同一组美元价或欧元价。地图仍会着色，表格默认把这些「同价篮子」合并，避免 100 多个相同数字占满榜单。
        </p>
        <p>未计入增值税、销售税和支付渠道手续费。官方原文：{CATALOG.source.disclaimer}</p>
        <p>XPrice 不做换区、虚拟账单地址、礼品卡或代订。发现某市场标价更低，只表示官方对本币市场的定价，不表示你可以按该价格在其他地区购买。</p>
      </div>
      <p className="mt-8">
        <Link className="text-amber" href="/">
          返回地图
        </Link>
      </p>
    </main>
  );
}
