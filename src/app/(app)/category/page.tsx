import { getCategories } from "@/lib/api/categories";
import { CategoryList } from "@/components/category/CategoryList/CategoryList";

export default async function CategoryPage() {
  const categories = await getCategories();

  return <CategoryList categories={categories} />;
}
