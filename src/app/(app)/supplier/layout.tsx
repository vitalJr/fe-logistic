import { PageContainer } from "@/components/ui/PageContainer";
import { SupplierHeader } from "./SupplierHeader";

export default function SupplierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageContainer>
      <SupplierHeader />
      {children}
    </PageContainer>
  );
}
