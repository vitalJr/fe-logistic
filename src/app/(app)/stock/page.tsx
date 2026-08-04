import { getProducts } from "@/lib/api/products";
import { getSuppliers } from "@/lib/api/suppliers";
import { getCustomers } from "@/lib/api/customers";
import { StockOverviewList } from "@/components/stock/StockOverviewList/StockOverviewList";

export default async function StockPage() {
  const [products, suppliers, customers] = await Promise.all([
    getProducts(),
    getSuppliers(),
    getCustomers(),
  ]);

  const lowStockCount = products.filter(
    (product) => product.stockQuantity < product.minStock,
  ).length;

  return (
    <StockOverviewList
      products={products}
      lowStockCount={lowStockCount}
      suppliers={suppliers.filter((supplier) => supplier.active)}
      customers={customers.filter((customer) => customer.active)}
    />
  );
}
