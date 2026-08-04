import { PageContainer } from "@/components/ui/PageContainer";
import { StockHeader } from "./StockHeader";

export default function StockLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageContainer>
      <StockHeader />
      {children}
    </PageContainer>
  );
}
