import { CategoryForm } from "@/components/category/CategoryForm/CategoryForm";
import { createCategoryAction } from "@/app/(app)/category/actions";
import { Card } from "@/components/ui/Card";

export default function NewCategoryPage() {
  return (
    <Card>
      <CategoryForm
        action={createCategoryAction}
        submitLabel="Criar categoria"
        pendingLabel="Criando..."
      />
    </Card>
  );
}
