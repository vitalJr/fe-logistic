import { getSuppliers } from "@/lib/api/suppliers";
import { SupplierList } from "@/components/supplier/SupplierList/SupplierList";

export default async function SupplierPage() {
  const suppliers = await getSuppliers();

  return <SupplierList suppliers={suppliers} />;
}
