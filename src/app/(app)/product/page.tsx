import { getProducts } from "@/lib/api/products";
import { getAllCategories } from "@/lib/api/categories";
import { ProductList } from "@/components/product/ProductList/ProductList";

export default async function ProductPage() {
  const [products, categories] = await Promise.all([getProducts(), getAllCategories()]);

  return <ProductList products={products} categories={categories} />;
}
