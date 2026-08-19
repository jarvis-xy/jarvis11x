import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const paste = readFileSync(join(root, "data/official-paste.zh.txt"), "utf8");
const catalog = JSON.parse(readFileSync(join(root, "data/markets.json"), "utf8"));

const zhToIso = [
  ["美国", "US"],
  ["英国", "GB"],
  ["加拿大", "CA"],
  ["澳大利亚", "AU"],
  ["新西兰", "NZ"],
  ["日本", "JP"],
  ["巴西", "BR"],
  ["印度尼西亚", "ID"],
  ["印度", "IN"],
  ["沙特阿拉伯", "SA"],
  ["法国", "FR"],
  ["德国", "DE"],
  ["西班牙", "ES"],
  ["意大利", "IT"],
  ["葡萄牙", "PT"],
  ["荷兰", "NL"],
  ["波兰", "PL"],
  ["爱尔兰", "IE"],
  ["比利时", "BE"],
  ["瑞典", "SE"],
  ["罗马尼亚", "RO"],
  ["捷克共和国", "CZ"],
  ["芬兰", "FI"],
  ["丹麦", "DK"],
  ["希腊", "GR"],
  ["奥地利", "AT"],
  ["匈牙利", "HU"],
  ["保加利亚", "BG"],
  ["立陶宛", "LT"],
  ["斯洛伐克", "SK"],
  ["拉脱维亚", "LV"],
  ["斯洛文尼亚", "SI"],
  ["爱沙尼亚", "EE"],
  ["克罗地亚", "HR"],
  ["卢森堡", "LU"],
  ["马耳他", "MT"],
  ["塞浦路斯", "CY"],
  ["火鸡", "TR"],
  ["墨西哥", "MX"],
  ["泰国", "TH"],
  ["菲律宾", "PH"],
  ["南非", "ZA"],
  ["阿根廷", "AR"],
  ["韩国", "KR"],
  ["埃及", "EG"],
  ["尼日利亚", "NG"],
  ["马来西亚", "MY"],
  ["哥伦比亚", "CO"],
  ["智利", "CL"],
  ["新加坡", "SG"],
  ["阿拉伯联合酋长国（阿联酋）", "AE"],
  ["乌克兰", "UA"],
  ["肯尼亚", "KE"],
  ["以色列", "IL"],
  ["多明尼加共和国", "DO"],
  ["瑞士", "CH"],
  ["冰岛", "IS"],
  ["挪威", "NO"],
  ["阿富汗", "AF"],
  ["阿尔巴尼亚", "AL"],
  ["阿尔及利亚", "DZ"],
  ["安哥拉", "AO"],
  ["安圭拉", "AI"],
  ["安提瓜和巴布达", "AG"],
  ["亚美尼亚", "AM"],
  ["阿鲁巴", "AW"],
  ["阿塞拜疆", "AZ"],
  ["巴哈马", "BS"],
  ["巴林", "BH"],
  ["孟加拉国", "BD"],
  ["巴巴多斯", "BB"],
  ["白俄罗斯", "BY"],
  ["伯利兹", "BZ"],
  ["贝宁", "BJ"],
  ["百慕大", "BM"],
  ["不丹", "BT"],
  ["玻利维亚", "BO"],
  ["波斯尼亚和黑塞哥维那", "BA"],
  ["博茨瓦纳", "BW"],
  ["英属维尔京群岛", "VG"],
  ["文莱", "BN"],
  ["布基纳法索", "BF"],
  ["柬埔寨", "KH"],
  ["喀麦隆", "CM"],
  ["佛得角", "CV"],
  ["开曼群岛", "KY"],
  ["中非共和国", "CF"],
  ["乍得", "TD"],
  ["科摩罗", "KM"],
  ["刚果民主共和国（金沙萨）", "CD"],
  ["刚果共和国（布拉柴维尔）", "CG"],
  ["哥斯达黎加", "CR"],
  ["科特迪瓦", "CI"],
  ["吉布提", "DJ"],
  ["多米尼克", "DM"],
  ["厄瓜多尔", "EC"],
  ["萨尔瓦多", "SV"],
  ["赤道几内亚", "GQ"],
  ["厄立特里亚", "ER"],
  ["斐济", "FJ"],
  ["加蓬", "GA"],
  ["冈比亚", "GM"],
  ["乔治亚州", "GE"],
  ["加纳", "GH"],
  ["格林纳达", "GD"],
  ["危地马拉", "GT"],
  ["几内亚比绍", "GW"],
  ["圭亚那", "GY"],
  ["海地", "HT"],
  ["洪都拉斯", "HN"],
  ["香港", "HK"],
  ["伊拉克", "IQ"],
  ["牙买加", "JM"],
  ["约旦", "JO"],
  ["哈萨克斯坦", "KZ"],
  ["科威特", "KW"],
  ["吉尔吉斯斯坦", "KG"],
  ["老挝", "LA"],
  ["黎巴嫩", "LB"],
  ["利比里亚", "LR"],
  ["利比亚", "LY"],
  ["列支敦士登", "LI"],
  ["澳门", "MO"],
  ["马达加斯加", "MG"],
  ["马拉维", "MW"],
  ["马尔代夫", "MV"],
  ["马里", "ML"],
  ["毛里塔尼亚", "MR"],
  ["毛里求斯", "MU"],
  ["密克罗尼西亚", "FM"],
  ["摩尔多瓦", "MD"],
  ["蒙古", "MN"],
  ["黑山", "ME"],
  ["蒙特塞拉特", "MS"],
  ["摩洛哥", "MA"],
  ["莫桑比克", "MZ"],
  ["缅甸", "MM"],
  ["纳米比亚", "NA"],
  ["瑙鲁", "NR"],
  ["尼泊尔", "NP"],
  ["尼加拉瓜", "NI"],
  ["尼日尔", "NE"],
  ["北马其顿", "MK"],
  ["阿曼", "OM"],
  ["巴基斯坦", "PK"],
  ["帕劳", "PW"],
  ["巴拿马", "PA"],
  ["巴布亚新几内亚", "PG"],
  ["巴拉圭", "PY"],
  ["秘鲁", "PE"],
  ["卡塔尔", "QA"],
  ["卢旺达", "RW"],
  ["萨摩亚", "WS"],
  ["圣马力诺", "SM"],
  ["圣多美和普林西比", "ST"],
  ["塞内加尔", "SN"],
  ["塞尔维亚", "RS"],
  ["塞舌尔", "SC"],
  ["塞拉利昂", "SL"],
  ["所罗门群岛", "SB"],
  ["斯里兰卡", "LK"],
  ["圣基茨和尼维斯", "KN"],
  ["圣卢西亚", "LC"],
  ["圣文森特和格林纳丁斯", "VC"],
  ["苏里南", "SR"],
  ["台湾", "TW"],
  ["塔吉克斯坦", "TJ"],
  ["坦桑尼亚", "TZ"],
  ["多哥", "TG"],
  ["汤加", "TO"],
  ["特立尼达和多巴哥", "TT"],
  ["突尼斯", "TN"],
  ["土库曼斯坦", "TM"],
  ["特克斯和凯科斯群岛", "TC"],
  ["乌干达", "UG"],
  ["乌拉圭", "UY"],
  ["乌兹别克斯坦", "UZ"],
  ["瓦努阿图", "VU"],
  ["梵蒂冈城", "VA"],
  ["委内瑞拉", "VE"],
  ["越南", "VN"],
  ["也门", "YE"],
  ["赞比亚", "ZM"],
  ["津巴布韦", "ZW"],
  ["斯威士兰", "SZ"],
  ["直布罗陀", "GI"],
  ["几内亚", "GN"],
  ["科索沃", "XK"],
  ["摩纳哥", "MC"],
  ["索马里", "SO"],
];

const currencyHint = {
  美元: "USD",
  英镑: "GBP",
  加元: "CAD",
  澳元: "AUD",
  新西兰元: "NZD",
  日元: "JPY",
  巴西雷亚尔: "BRL",
  印尼盾: "IDR",
  印度卢比: "INR",
  沙特里亚尔: "SAR",
  欧元: "EUR",
  波兰兹罗提: "PLN",
  瑞典克朗: "SEK",
  罗马尼亚列伊: "RON",
  捷克克朗: "CZK",
  丹麦克朗: "DKK",
  匈牙利福林: "HUF",
  保加利亚列弗: "BGN",
  土耳其里拉: "TRY",
  试炼: "TRY",
  特里尔: "TRY",
  墨西哥比索: "MXN",
  泰铢: "THB",
  菲律宾比索: "PHP",
  南非兰特: "ZAR",
  韩元: "KRW",
  埃及镑: "EGP",
  尼日利亚奈拉: "NGN",
  马来西亚林吉特: "MYR",
  马币: "MYR",
  哥伦比亚比索: "COP",
  智利比索: "CLP",
  CPL: "CLP",
  新加坡元: "SGD",
  阿联酋迪拉姆: "AED",
  肯尼亚先令: "KES",
  ILS: "ILS",
  以色列新谢克尔: "ILS",
  瑞士法郎: "CHF",
  冰岛克朗: "ISK",
  ISK: "ISK",
  挪威克朗: "NOK",
  孟加拉塔卡: "BDT",
  港元: "HKD",
  港币: "HKD",
  坚戈: "KZT",
  巴基斯坦卢比: "PKR",
  钢笔: "PEN",
  笔: "PEN",
  便士: "PEN",
  卡塔尔里亚尔: "QAR",
  新台币: "TWD",
  坦桑尼亚先令: "TZS",
  越南盾: "VND",
};

function parseChunk(chunk) {
  const tokens = [];
  const re =
    /([\d,]+(?:\.\d+)?)\s*(美元|英镑|加元|澳元|新西兰元|日元|巴西雷亚尔|印尼盾|印度卢比|沙特里亚尔|欧元|波兰兹罗提|瑞典克朗|罗马尼亚列伊|捷克克朗|丹麦克朗|匈牙利福林|保加利亚列弗|土耳其里拉|试炼|特里尔|墨西哥比索|泰铢|菲律宾比索|南非兰特|韩元|埃及镑|尼日利亚奈拉|马来西亚林吉特|马币|哥伦比亚比索|智利比索|CPL|新加坡元|阿联酋迪拉姆|肯尼亚先令|以色列新谢克尔|ILS|瑞士法郎|冰岛克朗|ISK|挪威克朗|孟加拉塔卡|港元|港币|坚戈|巴基斯坦卢比|钢笔|笔|便士|卡塔尔里亚尔|新台币|坦桑尼亚先令|越南盾)?/g;
  let match;
  while ((match = re.exec(chunk))) {
    tokens.push({
      amount: Number(match[1].replace(/,/g, "")),
      currency: match[2] ? currencyHint[match[2]] : null,
    });
  }
  return tokens.slice(0, 6);
}

const parsed = [];
const missingNames = [];
let cursor = 0;
for (const [name, iso] of zhToIso) {
  const index = paste.indexOf(name, cursor);
  if (index < 0) {
    missingNames.push({ name, iso });
    continue;
  }
  cursor = index + name.length;
  parsed.push({ name, iso, at: index });
}

for (let i = 0; i < parsed.length; i++) {
  const start = parsed[i].at + parsed[i].name.length;
  const end = i + 1 < parsed.length ? parsed[i + 1].at : paste.length;
  parsed[i].prices = parseChunk(paste.slice(start, end));
}

const listed = catalog.markets.filter((m) => m.availability === "listed");
const byIso = Object.fromEntries(listed.map((m) => [m.iso2, m]));
const pasteIsos = new Set(parsed.map((row) => row.iso));
const extraInApp = listed.filter((m) => !pasteIsos.has(m.iso2)).map((m) => `${m.nameZh} (${m.iso2})`);
const missingInApp = parsed.filter((row) => !byIso[row.iso]).map((row) => `${row.name} (${row.iso})`);

const keys = ["basic.month", "basic.year", "premium.month", "premium.year", "plus.month", "plus.year"];
const mismatches = [];
const shortRows = [];
for (const row of parsed) {
  const market = byIso[row.iso];
  if (!market) continue;
  if (row.prices.length !== 6) {
    shortRows.push({ iso: row.iso, name: row.name, count: row.prices.length, prices: row.prices });
    continue;
  }
  const ours = [
    market.prices.basic.month,
    market.prices.basic.year,
    market.prices.premium.month,
    market.prices.premium.year,
    market.prices.plus.month,
    market.prices.plus.year,
  ];
  const ourCcy = market.currency;
  for (let i = 0; i < 6; i++) {
    const theirs = row.prices[i];
    const amountDiff = Math.abs(theirs.amount - ours[i]) > 0.001;
    const ccyDiff = theirs.currency && theirs.currency !== ourCcy && !(row.iso === "CL" && theirs.currency === "CLP");
    if (amountDiff || ccyDiff) {
      mismatches.push({
        iso: row.iso,
        name: row.name,
        field: keys[i],
        paste: theirs,
        ours: { amount: ours[i], currency: ourCcy },
      });
    }
  }
}

console.log(
  JSON.stringify(
    {
      pasteCountries: parsed.length,
      expected: zhToIso.length,
      appListed: listed.length,
      appIncludingUnpublished: catalog.markets.length,
      missingNames,
      missingInApp,
      extraInApp,
      shortRows,
      mismatches,
    },
    null,
    2,
  ),
);
