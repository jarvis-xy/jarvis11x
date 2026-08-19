import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json" with { type: "json" };
import zh from "i18n-iso-countries/langs/zh.json" with { type: "json" };

countries.registerLocale(en);
countries.registerLocale(zh);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const table = readFileSync(join(root, "data/official-table.md"), "utf8");

const aliases = {
  "United Arab Emirates (UAE)": "AE",
  "Congo, Democratic Republic of the (Kinshasa)": "CD",
  "Congo, Republic of the (Brazzaville)": "CG",
  "Cote D'Ivoire": "CI",
  "Hong Kong": "HK",
  Macau: "MO",
  Taiwan: "TW",
  "Vatican City": "VA",
  "St. Kitts and Nevis": "KN",
  "St. Lucia": "LC",
  "St. Vincent and the Grenadines": "VC",
  "British Virgin Islands": "VG",
  "São Tomé and Príncipe": "ST",
  Eswatini: "SZ",
  "Cape Verde": "CV",
  "Cayman Islands": "KY",
  "Turks and Caicos Islands": "TC",
  "Antigua and Barbuda": "AG",
  "Bosnia and Herzegovina": "BA",
  "Dominican Republic": "DO",
  "El Salvador": "SV",
  "Equatorial Guinea": "GQ",
  "Guinea-Bissau": "GW",
  "North Macedonia": "MK",
  "Papua New Guinea": "PG",
  "San Marino": "SM",
  "Solomon Islands": "SB",
  "South Africa": "ZA",
  "South Korea": "KR",
  "Sri Lanka": "LK",
  "Trinidad and Tobago": "TT",
  "United Kingdom": "GB",
  "United States": "US",
  "Central African Republic": "CF",
  "Czech Republic": "CZ",
  Kosovo: "XK",
  Micronesia: "FM",
  "Burkina Faso": "BF",
  "Costa Rica": "CR",
  "New Zealand": "NZ",
  "Saudi Arabia": "SA",
  "Sierra Leone": "SL",
  Brunei: "BN",
  "Gambia": "GM",
  "Bahamas": "BS",
  "Palestine": "PS",
  "Russia": "RU",
  "Syria": "SY",
  "Tanzania": "TZ",
  "Venezuela": "VE",
  "Vietnam": "VN",
  "Bolivia": "BO",
  "Iran": "IR",
  "Laos": "LA",
  "Moldova": "MD",
  "Netherlands": "NL",
  "Philippines": "PH",
  "Turkiye": "TR",
  Turkey: "TR",
};

const zhOverrides = {
  US: "美国",
  GB: "英国",
  KR: "韩国",
  KP: "朝鲜",
  RU: "俄罗斯",
  CZ: "捷克",
  AE: "阿联酋",
  HK: "香港",
  MO: "澳门",
  TW: "台湾",
  CD: "刚果（金）",
  CG: "刚果（布）",
  CI: "科特迪瓦",
  VA: "梵蒂冈",
  XK: "科索沃",
  SZ: "斯威士兰",
  MK: "北马其顿",
  FM: "密克罗尼西亚",
  ST: "圣多美和普林西比",
  KN: "圣基茨和尼维斯",
  LC: "圣卢西亚",
  VC: "圣文森特和格林纳丁斯",
  VG: "英属维尔京群岛",
  TC: "特克斯和凯科斯群岛",
  KY: "开曼群岛",
  AI: "安圭拉",
  MS: "蒙特塞拉特",
  BM: "百慕大",
  GI: "直布罗陀",
  CW: "库拉索",
  AW: "阿鲁巴",
};

function parseCell(cell) {
  const text = cell.replace(/,/g, "").trim();
  const match = text.match(/^([\d.]+)\s*([A-Z]{3})?$/);
  if (!match) throw new Error(`Cannot parse price cell: ${cell}`);
  const currency = match[2] === "CPL" ? "CLP" : match[2] ?? "USD";
  return { amount: Number(match[1]), currency };
}

function resolveIso(name) {
  if (aliases[name]) return aliases[name];
  const variants = [
    name,
    `${name} (the)`,
    name.replace(/^The /, ""),
    `${name} Darussalam`,
    `${name}, Republic of`,
    `${name}, Plurinational State of`,
    `Republic of ${name}`,
  ];
  for (const variant of variants) {
    const iso = countries.getAlpha2Code(variant, "en");
    if (iso) return iso;
  }
  throw new Error(`No ISO code for ${name}`);
}

const markets = [];
for (const line of table.split("\n")) {
  if (!line.startsWith("|") || line.includes("Country") || line.includes("---")) continue;
  const cols = line
    .split("|")
    .slice(1, -1)
    .map((part) => part.trim());
  if (cols.length < 7) continue;
  const [nameEn, ...priceCols] = cols;
  const parsed = priceCols.map(parseCell);
  const currency = parsed[0].currency;
  const iso2 = resolveIso(nameEn);
  markets.push({
    iso2,
    iso3: countries.alpha2ToAlpha3(iso2) ?? iso2,
    numeric: String(countries.alpha2ToNumeric(iso2) ?? ""),
    nameEn,
    nameZh: zhOverrides[iso2] ?? countries.getName(iso2, "zh") ?? nameEn,
    currency,
    availability: "listed",
    prices: {
      basic: { month: parsed[0].amount, year: parsed[1].amount },
      premium: { month: parsed[2].amount, year: parsed[3].amount },
      plus: { month: parsed[4].amount, year: parsed[5].amount },
    },
    notes: [],
  });
}

function signature(market) {
  const { basic, premium, plus } = market.prices;
  return [market.currency, basic.month, basic.year, premium.month, premium.year, plus.month, plus.year].join("|");
}

const byIso = Object.fromEntries(markets.map((market) => [market.iso2, market]));
const us = signature(byIso.US);
const fr = signature(byIso.FR);
const gb = signature(byIso.GB);
const ch = signature(byIso.CH);

for (const market of markets) {
  const key = signature(market);
  if (key === us) market.pricingGroup = "usd_basket";
  else if (key === fr) market.pricingGroup = "eur_basket";
  else if (key === gb) market.pricingGroup = "gbp_basket";
  else if (key === ch) market.pricingGroup = "chf_basket";
  else market.pricingGroup = "localized";
}

byIso.BE.notes.push("比利时 Premium+ 月付为 €46，年付与其他欧元区相同，仍为 €377。");
byIso.CL.notes.push("官方表年付货币写作 CPL，按智利比索 CLP 处理。");
byIso.NG.notes.push("奈拉汇率波动大，折算排名会随汇率变化。");
byIso.TR.notes.push("里拉汇率波动大，折算排名会随汇率变化。");
byIso.EG.notes.push("埃镑汇率波动大，折算排名会随汇率变化。");

markets.sort((a, b) => a.nameZh.localeCompare(b.nameZh, "zh"));

const payload = {
  source: {
    title: "X Help · About X Premium",
    url: "https://help.x.com/en/using-x/x-premium#tbpricing-bycountry",
    capturedAt: "2026-05-06",
    channel: "web",
    disclaimer: "Prices may vary by location, applicable taxes, and your payment method fees.",
  },
  generatedAt: new Date().toISOString(),
  markets,
};

writeFileSync(join(root, "data/markets.json"), `${JSON.stringify(payload, null, 2)}\n`);

const groups = {};
for (const market of markets) {
  groups[market.pricingGroup] = (groups[market.pricingGroup] ?? 0) + 1;
}
console.log(`Wrote ${markets.length} markets`, groups);
