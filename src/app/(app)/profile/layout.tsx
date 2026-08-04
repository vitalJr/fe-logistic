import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageContainer>
      <PageHeader
        title="Perfil"
        description="Confira suas informações e complete o cadastro."
      />
      {children}
    </PageContainer>
  );
}
