import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import ja from "i18n-iso-countries/langs/ja.json";
import ko from "i18n-iso-countries/langs/ko.json";
import vi from "i18n-iso-countries/langs/vi.json";
import zh from "i18n-iso-countries/langs/zh.json";
import type { Cycle, PricingGroup } from "./types";

countries.registerLocale(en);
countries.registerLocale(zh);
countries.registerLocale(ja);
countries.registerLocale(ko);
countries.registerLocale(vi);

export type Locale = "zh" | "en" | "vi" | "ja" | "ko";

export const LOCALES: Locale[] = ["zh", "en", "vi", "ja", "ko"];

export const LOCALE_OPTIONS: Array<{ value: Locale; label: string }> = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
];

export const HTML_LANG: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en",
  vi: "vi",
  ja: "ja",
  ko: "ko",
};

export const NUMBER_LOCALE: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en-US",
  vi: "vi-VN",
  ja: "ja-JP",
  ko: "ko-KR",
};

const COUNTRY_LANG: Record<Locale, string> = {
  zh: "zh",
  en: "en",
  vi: "vi",
  ja: "ja",
  ko: "ko",
};

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

type Dict = Record<string, string>;

const zhDict: Dict = {
  taglineLead: "比较各国 X Premium 网页标价，由",
  taglineTail: " 开发。iOS / Android 因商店抽成通常更高。",
  month: "月付",
  year: "年付",
  cny: "人民币",
  usd: "美元",
  cheapest: "标价最低",
  dearest: "标价最高",
  spread: "高低价差",
  spreadDetail: "按美元折算",
  compiledAt: "整理日期",
  fx: "汇率",
  searchLabel: "搜索国家或地区",
  searchPlaceholder: "搜索国家、地区或代码，例如 日本 / JP",
  cheap: "便宜",
  dear: "贵",
  tableTitle: "完整标价表",
  tableHint: "列出全部 {n} 个有标价的市场。美区同价默认折叠，点击展开。美价折扣按美国 Web 标价折算，负数为更便宜。",
  colMarket: "市场",
  colGroup: "分组",
  colLocal: "本币",
  colAnnualMonth: "年付等效月费",
  colUsDiscount: "美价折扣",
  usSamePrice: "美区同价",
  marketCount: "{n} 个市场",
  clickExpand: "点击展开",
  clickCollapse: "点击收起",
  baseline: "基准",
  footerLead: "本站数据由",
  footerTail: " 整理，如有误差，请以官方为准。",
  disclaimer:
    "免责声明：XPrice 与 X Corp. 无关联，仅供浏览参考，不构成购买建议。展示价格为整理后的 Web 标价及公开中间价折算，未含税与支付手续费，可能与收银台实际应付金额不一致。iOS / Android 因应用商店抽成，通常更高。本站不提供换区、虚拟地址、礼品卡或代订服务。",
  methodology: "方法与口径",
  mapLoading: "正在铺地图",
  mapAria: "X Premium 全球标价地图",
  unknownRegion: "未知地区",
  noFx: "无折算",
  close: "关闭",
  unpublished: "本站暂未收录该市场标价，因此没有可换算的数字。",
  vsUs: "相对美国 {pct}",
  noRate: "无汇率",
  colTier: "档位",
  annualMonthFee: "年付等效月费 {price}",
  annualSave: "相对 12 个月付可少付 {price}（{pct}）",
  groupLocalized: "本地化标价",
  groupUsd: "美元同价",
  groupEur: "欧元同价",
  groupGbp: "英镑同价",
  groupChf: "法郎同价",
  groupUnpublished: "官方未列出",
  language: "语言",
  switchLanguage: "切换",
  methKicker: "方法与口径",
  methTitle: "方法与口径",
  methP1Lead: "本站数据由",
  methP1Tail: " 整理。页面展示的是各国 Web 标价及公开中间价折算，不是收银台实时价。如有误差，请以官方为准。",
  methP2: "美元与人民币由公开中间价折算，汇率日期显示在首页。部分市场的排名会随汇率变动，即使本币标价没有变化。数据整理日期 {date}。",
  methP3:
    "完整标价表列出所有已收录、有 Web 标价的市场。折算后与美国 Web 标价相同的市场（含本地化标价）合并为一行，默认折叠，点击后展开。美价折扣以美国同一档位、同一付费周期的 Web 标价为基准：当地折算美元价 ÷ 美国价 − 1。负数为低于美价，正数为高于美价。美国行为基准。",
  methP4: "未计入增值税、销售税和支付渠道手续费，因此展示金额可能与实际应付不一致。本站为网页标价。iOS / Android 因应用商店抽成，通常更高。",
  methP5:
    "XPrice 与 X Corp. 无关联。本站仅供浏览参考，不构成购买建议，也不提供换区、虚拟账单地址、礼品卡或代订。某市场标价更低，只表示该市场的整理标价，不表示你可以按该价格在其他地区购买。",
  backToMap: "返回地图",
};

const enDict: Dict = {
  taglineLead: "Compare X Premium web prices by country. Built by",
  taglineTail: ". iOS / Android is usually higher because of store fees.",
  month: "Monthly",
  year: "Yearly",
  cny: "CNY",
  usd: "USD",
  cheapest: "Lowest",
  dearest: "Highest",
  spread: "Spread",
  spreadDetail: "In USD",
  compiledAt: "Compiled",
  fx: "FX",
  searchLabel: "Search countries or regions",
  searchPlaceholder: "Search a country, region, or code, e.g. Japan / JP",
  cheap: "Cheap",
  dear: "Dear",
  tableTitle: "Full price table",
  tableHint:
    "{n} priced markets. US-equivalent rows stay collapsed until opened. Discount is versus US web list price; negative means cheaper.",
  colMarket: "Market",
  colGroup: "Group",
  colLocal: "Local",
  colAnnualMonth: "Annual / 12",
  colUsDiscount: "vs US",
  usSamePrice: "US list price",
  marketCount: "{n} markets",
  clickExpand: "Expand",
  clickCollapse: "Collapse",
  baseline: "Baseline",
  footerLead: "Prices compiled by",
  footerTail: ". If anything is off, follow the official listing.",
  disclaimer:
    "Disclaimer: XPrice is not affiliated with X Corp. For reference only, not buying advice. Figures are compiled web list prices converted at mid-market FX, excluding tax and payment fees, so checkout totals may differ. iOS / Android is usually higher because of store fees. No region switching, fake billing addresses, gift cards, or proxy buying.",
  methodology: "Methodology",
  mapLoading: "Loading map",
  mapAria: "X Premium global price map",
  unknownRegion: "Unknown",
  noFx: "No FX",
  close: "Close",
  unpublished: "This market is not in the compiled web list, so there is no convertible price.",
  vsUs: "vs US {pct}",
  noRate: "No FX rate",
  colTier: "Tier",
  annualMonthFee: "Annual equivalent monthly {price}",
  annualSave: "Saves {price} versus 12 monthly payments ({pct})",
  groupLocalized: "Localized",
  groupUsd: "USD list",
  groupEur: "EUR list",
  groupGbp: "GBP list",
  groupChf: "CHF list",
  groupUnpublished: "Unlisted",
  language: "Language",
  switchLanguage: "Language",
  methKicker: "Methodology",
  methTitle: "Methodology",
  methP1Lead: "Prices compiled by",
  methP1Tail: ". This page shows web list prices converted at mid-market FX, not live checkout. If anything is off, follow the official listing.",
  methP2: "USD and CNY use public mid-market rates; the FX date is on the home page. Rankings can move with FX even when local list prices do not. Compiled {date}.",
  methP3:
    "The full table includes every compiled web-priced market. Markets that match the US web list, including some localized ones, collapse into one row until expanded. vs US is local USD ÷ US price − 1. Negative is cheaper than the US. The US row is the baseline.",
  methP4: "VAT, sales tax, and payment fees are excluded, so checkout totals may differ. These are web list prices. iOS / Android is usually higher because of store fees.",
  methP5:
    "XPrice is not affiliated with X Corp. For reference only, not buying advice, and it does not offer region switching, fake billing addresses, gift cards, or proxy buying. A cheaper market only means that market’s compiled list price, not that you can buy at that price from elsewhere.",
  backToMap: "Back to map",
};

const viDict: Dict = {
  taglineLead: "So sánh giá web X Premium theo quốc gia, phát triển bởi",
  taglineTail: ". iOS / Android thường đắt hơn vì phí cửa hàng.",
  month: "Tháng",
  year: "Năm",
  cny: "CNY",
  usd: "USD",
  cheapest: "Rẻ nhất",
  dearest: "Đắt nhất",
  spread: "Chênh lệch",
  spreadDetail: "Theo USD",
  compiledAt: "Ngày biên soạn",
  fx: "Tỷ giá",
  searchLabel: "Tìm quốc gia hoặc vùng",
  searchPlaceholder: "Tìm quốc gia, vùng hoặc mã, ví dụ Japan / JP",
  cheap: "Rẻ",
  dear: "Đắt",
  tableTitle: "Bảng giá đầy đủ",
  tableHint:
    "{n} thị trường có giá. Các dòng giá Mỹ được thu gọn mặc định. Chiết khấu so với giá web Mỹ; số âm là rẻ hơn.",
  colMarket: "Thị trường",
  colGroup: "Nhóm",
  colLocal: "Nội tệ",
  colAnnualMonth: "Năm / 12",
  colUsDiscount: "so với Mỹ",
  usSamePrice: "Giá danh sách Mỹ",
  marketCount: "{n} thị trường",
  clickExpand: "Mở",
  clickCollapse: "Thu",
  baseline: "Chuẩn",
  footerLead: "Dữ liệu do",
  footerTail: " biên soạn. Nếu sai, hãy theo bảng chính thức.",
  disclaimer:
    "Tuyên bố: XPrice không liên kết với X Corp. Chỉ để tham khảo, không phải lời khuyên mua. Giá là giá web đã biên soạn, quy đổi theo tỷ giá trung thị, chưa gồm thuế và phí thanh toán, nên số tiền thanh toán có thể khác. iOS / Android thường đắt hơn vì phí cửa hàng. Không hỗ trợ đổi vùng, địa chỉ ảo, thẻ quà tặng hay mua hộ.",
  methodology: "Phương pháp",
  mapLoading: "Đang tải bản đồ",
  mapAria: "Bản đồ giá X Premium toàn cầu",
  unknownRegion: "Không rõ",
  noFx: "Không có tỷ giá",
  close: "Đóng",
  unpublished: "Thị trường này chưa có trong bảng giá web nên không quy đổi được.",
  vsUs: "so với Mỹ {pct}",
  noRate: "Không có tỷ giá",
  colTier: "Gói",
  annualMonthFee: "Giá tháng quy đổi từ năm {price}",
  annualSave: "Tiết kiệm {price} so với 12 tháng lẻ ({pct})",
  groupLocalized: "Giá bản địa",
  groupUsd: "Giá USD",
  groupEur: "Giá EUR",
  groupGbp: "Giá GBP",
  groupChf: "Giá CHF",
  groupUnpublished: "Chưa liệt kê",
  language: "Ngôn ngữ",
  switchLanguage: "Ngôn ngữ",
  methKicker: "Phương pháp",
  methTitle: "Phương pháp",
  methP1Lead: "Dữ liệu do",
  methP1Tail: " biên soạn. Trang này hiện giá web và quy đổi tỷ giá trung thị, không phải giá thanh toán. Nếu sai, hãy theo bảng chính thức.",
  methP2: "USD và CNY dùng tỷ giá trung thị công khai; ngày tỷ giá ở trang chủ. Thứ hạng có thể đổi theo tỷ giá dù giá nội tệ không đổi. Biên soạn {date}.",
  methP3:
    "Bảng đầy đủ gồm mọi thị trường có giá web. Thị trường trùng giá web Mỹ (kể cả một số giá bản địa) được gộp một dòng, mặc định thu gọn. so với Mỹ = USD địa phương ÷ giá Mỹ − 1. Số âm là rẻ hơn Mỹ. Hàng Mỹ là chuẩn.",
  methP4: "Chưa gồm VAT, thuế bán hàng và phí thanh toán nên số tiền thực tế có thể khác. Đây là giá web. iOS / Android thường đắt hơn vì phí cửa hàng.",
  methP5:
    "XPrice không liên kết với X Corp. Chỉ để tham khảo, không phải lời khuyên mua, và không hỗ trợ đổi vùng, địa chỉ ảo, thẻ quà tặng hay mua hộ. Thị trường rẻ hơn chỉ nghĩa là giá danh sách đã biên soạn của thị trường đó, không nghĩa là bạn mua được giá đó từ nơi khác.",
  backToMap: "Về bản đồ",
};

const jaDict: Dict = {
  taglineLead: "各国の X Premium ウェブ価格を比較。開発：",
  taglineTail: "。iOS / Android はストア手数料のため、通常より高くなります。",
  month: "月額",
  year: "年額",
  cny: "人民元",
  usd: "米ドル",
  cheapest: "最安",
  dearest: "最高",
  spread: "価格差",
  spreadDetail: "米ドル換算",
  compiledAt: "整理日",
  fx: "為替",
  searchLabel: "国や地域を検索",
  searchPlaceholder: "国名・地域・コードで検索、例：日本 / JP",
  cheap: "安い",
  dear: "高い",
  tableTitle: "価格一覧",
  tableHint:
    "掲載 {n} 市場。米国と同額の行は初期状態で折りたたみ。割引は米国ウェブ価格比で、マイナスはより安いことを示します。",
  colMarket: "市場",
  colGroup: "区分",
  colLocal: "現地通貨",
  colAnnualMonth: "年額÷12",
  colUsDiscount: "対米国",
  usSamePrice: "米国と同額",
  marketCount: "{n} 市場",
  clickExpand: "開く",
  clickCollapse: "閉じる",
  baseline: "基準",
  footerLead: "データ整理：",
  footerTail: "。誤りがあれば公式表記を優先してください。",
  disclaimer:
    "免責：XPrice は X Corp. と無関係です。参考情報であり、購入助言ではありません。掲載は整理したウェブ価格を中値で換算したもので、税と決済手数料は含みません。会計金額と異なる場合があります。iOS / Android はストア手数料のため通常より高くなります。転地、架空請求先、ギフトカード、代理購入は扱いません。",
  methodology: "方法と定義",
  mapLoading: "地図を読み込み中",
  mapAria: "X Premium 世界価格地図",
  unknownRegion: "不明",
  noFx: "為替なし",
  close: "閉じる",
  unpublished: "この市場はウェブ価格表にないため、換算できる数字がありません。",
  vsUs: "対米国 {pct}",
  noRate: "為替なし",
  colTier: "プラン",
  annualMonthFee: "年額の月換算 {price}",
  annualSave: "月払い12回と比べ {price} お得（{pct}）",
  groupLocalized: "現地価格",
  groupUsd: "米ドル同額",
  groupEur: "ユーロ同額",
  groupGbp: "ポンド同額",
  groupChf: "フラン同額",
  groupUnpublished: "未掲載",
  language: "言語",
  switchLanguage: "言語",
  methKicker: "方法と定義",
  methTitle: "方法と定義",
  methP1Lead: "データ整理：",
  methP1Tail: "。表示は各国ウェブ価格と中値換算であり、会計の実勢価格ではありません。誤りがあれば公式を優先してください。",
  methP2: "米ドルと人民元は公開中値で換算し、為替日はトップに表示します。現地価格が変わらなくても、為替で順位は動き得ます。整理日 {date}。",
  methP3:
    "一覧はウェブ価格がある市場をすべて載せます。米国ウェブ価格と同額の市場（一部の現地価格を含む）は1行にまとめ、初期は折りたたみます。対米国は現地ドル換算 ÷ 米国価格 − 1。マイナスは米国より安いことを示し、米国行が基準です。",
  methP4: "付加価値税、売上税、決済手数料は含まないため、支払額と異なる場合があります。掲載はウェブ価格です。iOS / Android はストア手数料のため通常より高くなります。",
  methP5:
    "XPrice は X Corp. と無関係です。参考情報であり購入助言ではなく、転地、架空請求先、ギフトカード、代理購入も扱いません。ある市場が安いのは、その市場の整理価格という意味であり、他地域でその価格で買えるという意味ではありません。",
  backToMap: "地図に戻る",
};

const koDict: Dict = {
  taglineLead: "국가별 X Premium 웹 가격 비교. 개발:",
  taglineTail: ". iOS / Android는 스토어 수수료 때문에 보통 더 비쌉니다.",
  month: "월간",
  year: "연간",
  cny: "위안",
  usd: "달러",
  cheapest: "최저가",
  dearest: "최고가",
  spread: "가격 차이",
  spreadDetail: "달러 환산",
  compiledAt: "정리일",
  fx: "환율",
  searchLabel: "국가 또는 지역 검색",
  searchPlaceholder: "국가, 지역 또는 코드 검색, 예: Japan / JP",
  cheap: "저렴",
  dear: "비쌈",
  tableTitle: "전체 가격표",
  tableHint:
    "가격이 있는 시장 {n}곳. 미국과 같은 가격은 기본 접힘. 할인율은 미국 웹 가격 대비이며 음수는 더 저렴함을 뜻합니다.",
  colMarket: "시장",
  colGroup: "구분",
  colLocal: "현지 통화",
  colAnnualMonth: "연간÷12",
  colUsDiscount: "대 미국",
  usSamePrice: "미국 동일가",
  marketCount: "{n}개 시장",
  clickExpand: "펼치기",
  clickCollapse: "접기",
  baseline: "기준",
  footerLead: "데이터 정리:",
  footerTail: ". 오류가 있으면 공식 표기를 따르세요.",
  disclaimer:
    "면책: XPrice는 X Corp.와 무관합니다. 참고용이며 구매 조언이 아닙니다. 수치는 정리한 웹 가격을 중간 환율로 환산한 값이며 세금과 결제 수수료는 빠져 있어 결제 금액과 다를 수 있습니다. iOS / Android는 스토어 수수료 때문에 보통 더 비쌉니다. 지역 변경, 가상 청구지, 기프트카드, 대리 구매는 제공하지 않습니다.",
  methodology: "방법과 기준",
  mapLoading: "지도를 불러오는 중",
  mapAria: "X Premium 세계 가격 지도",
  unknownRegion: "알 수 없음",
  noFx: "환율 없음",
  close: "닫기",
  unpublished: "이 시장은 웹 가격표에 없어 환산할 숫자가 없습니다.",
  vsUs: "대 미국 {pct}",
  noRate: "환율 없음",
  colTier: "플랜",
  annualMonthFee: "연간 월 환산 {price}",
  annualSave: "월 12회 대비 {price} 절약 ({pct})",
  groupLocalized: "현지 가격",
  groupUsd: "달러 동일가",
  groupEur: "유로 동일가",
  groupGbp: "파운드 동일가",
  groupChf: "프랑 동일가",
  groupUnpublished: "미수록",
  language: "언어",
  switchLanguage: "언어",
  methKicker: "방법과 기준",
  methTitle: "방법과 기준",
  methP1Lead: "데이터 정리:",
  methP1Tail: ". 이 페이지는 각국 웹 가격과 중간 환율 환산이며 실시간 결제가가 아닙니다. 오류가 있으면 공식을 따르세요.",
  methP2: "달러와 위안은 공개 중간 환율로 환산하며, 환율 날짜는 홈에 있습니다. 현지 가격이 그대로여도 환율에 따라 순위가 바뀔 수 있습니다. 정리일 {date}.",
  methP3:
    "전체 표는 웹 가격이 있는 모든 시장을 담습니다. 미국 웹 가격과 같은 시장(일부 현지 가격 포함)은 한 줄로 합치고 기본은 접습니다. 대 미국은 현지 달러 환산 ÷ 미국 가격 − 1입니다. 음수는 미국보다 저렴하고, 미국 행이 기준입니다.",
  methP4: "부가세, 판매세, 결제 수수료는 빠져 있어 실결제액과 다를 수 있습니다. 웹 가격입니다. iOS / Android는 스토어 수수료 때문에 보통 더 비쌉니다.",
  methP5:
    "XPrice는 X Corp.와 무관합니다. 참고용이며 구매 조언이 아니고, 지역 변경, 가상 청구지, 기프트카드, 대리 구매도 하지 않습니다. 어떤 시장이 더 저렴하다는 것은 그 시장의 정리된 가격일 뿐, 다른 지역에서 그 가격으로 살 수 있다는 뜻이 아닙니다.",
  backToMap: "지도로",
};

const DICTS: Record<Locale, Dict> = {
  zh: zhDict,
  en: enDict,
  vi: viDict,
  ja: jaDict,
  ko: koDict,
};

export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  let text = DICTS[locale][key] ?? DICTS.zh[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export function cycleLabel(locale: Locale, cycle: Cycle): string {
  return t(locale, cycle);
}

export function groupLabel(locale: Locale, group: PricingGroup | string): string {
  const keys: Record<string, string> = {
    localized: "groupLocalized",
    usd_basket: "groupUsd",
    eur_basket: "groupEur",
    gbp_basket: "groupGbp",
    chf_basket: "groupChf",
    unpublished: "groupUnpublished",
  };
  return t(locale, keys[group] ?? "groupLocalized");
}

export function marketName(
  market: { iso2: string; nameEn: string; nameZh: string },
  locale: Locale,
): string {
  if (locale === "zh") return market.nameZh;
  if (locale === "en") return market.nameEn;
  return countries.getName(market.iso2, COUNTRY_LANG[locale]) ?? market.nameEn;
}
