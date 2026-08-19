import { redirect } from "next/navigation";
import { XPRICE_METHODOLOGY_PATH } from "@/lib/site";

export default function MethodologyRedirect() {
  redirect(XPRICE_METHODOLOGY_PATH);
}
