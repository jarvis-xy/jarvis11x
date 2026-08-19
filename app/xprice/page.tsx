import { PriceDesk } from "@/components/PriceDesk";
import { CATALOG } from "@/lib/catalog";
import { loadRates } from "@/lib/rates";
import { xpriceMetadata } from "@/lib/site";

export const revalidate = 3600;
export const metadata = xpriceMetadata();

export default async function XPricePage() {
  const rates = await loadRates();
  return <PriceDesk catalog={CATALOG} rates={rates} />;
}
