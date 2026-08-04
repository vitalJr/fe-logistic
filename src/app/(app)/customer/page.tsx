import { getCustomers } from "@/lib/api/customers";
import { CustomerList } from "@/components/customer/CustomerList/CustomerList";

export default async function CustomerPage() {
  const customers = await getCustomers();

  return <CustomerList customers={customers} />;
}
