import { CustomerForm } from "@/components/customer/CustomerForm/CustomerForm";
import { createCustomerAction } from "@/app/(app)/customer/actions";
import { Card } from "@/components/ui/Card";

export default function NewCustomerPage() {
  return (
    <Card>
      <CustomerForm
        action={createCustomerAction}
        submitLabel="Criar cliente"
        pendingLabel="Criando..."
      />
    </Card>
  );
}
