import { ProductForm } from "@/components/product/ProductForm/ProductForm";
import { createProductAction } from "@/app/(app)/product/actions";
import { getAllCategories } from "@/lib/api/categories";
import { Card } from "@/components/ui/Card";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <Card>
      <ProductForm
        action={createProductAction}
        categories={categories}
        submitLabel="Criar produto"
        pendingLabel="Criando..."
      />
    </Card>
  );
}
