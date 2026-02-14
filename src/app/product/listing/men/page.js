import CommonListing from "@/components/CommonListing";
import { productByCategory } from "@/services/product";

export default async function MenAllProducts() {
  const getAllProducts = await productByCategory("men");

  console.log("MEN PRODUCTS", getAllProducts);

  return <CommonListing data={getAllProducts?.data || []} />;
}
