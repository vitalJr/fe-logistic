import { PageContainer } from "@/components/ui/PageContainer";
import { CategoryHeader } from "./CategoryHeader";

export default function CategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageContainer>
      <CategoryHeader />
      {children}
    </PageContainer>
  );
}
