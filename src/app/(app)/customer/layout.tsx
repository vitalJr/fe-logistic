import { PageContainer } from "@/components/ui/PageContainer";
import { CustomerHeader } from "./CustomerHeader";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageContainer>
      <CustomerHeader />
      {children}
    </PageContainer>
  );
}
