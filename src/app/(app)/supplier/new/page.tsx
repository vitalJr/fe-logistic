import { SupplierForm } from "@/components/supplier/SupplierForm/SupplierForm";
import { createSupplierAction } from "@/app/(app)/supplier/actions";
import { Card } from "@/components/ui/Card";

export default function NewSupplierPage() {
  return (
    <Card>
      <SupplierForm
        action={createSupplierAction}
        submitLabel="Criar fornecedor"
        pendingLabel="Criando..."
      />
    </Card>
  );
}
