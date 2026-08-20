import { MethodologyBody } from "@/components/MethodologyBody";
import { XPRICE_URL, xpriceMetadata } from "@/lib/site";

export const metadata = {
  ...xpriceMetadata(`${XPRICE_URL}/methodology`),
  title: "方法与口径 · XPrice",
};

export default function MethodologyPage() {
  return <MethodologyBody />;
}
