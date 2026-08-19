import { PriceDesk } from "@/components/PriceDesk";
import { CATALOG } from "@/lib/catalog";
import { loadRates } from "@/lib/rates";

export const revalidate = 3600;

export default async function HomePage() {
  const rates = await loadRates();
  return <PriceDesk catalog={CATALOG} rates={rates} />;
}
