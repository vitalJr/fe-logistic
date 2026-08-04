import { PageContainer } from "@/components/ui/PageContainer";
import { ProductHeader } from "./ProductHeader";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageContainer>
      <ProductHeader />
      {children}
    </PageContainer>
  );
}
