import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { WarningTooltip } from "@/components/ui/WarningTooltip";
import { Button } from "@/components/ui/Button";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Sidebar } from "@/components/ui/Sidebar";
import { ModalDemo } from "./ModalDemo";
import { DrawerDemo } from "./DrawerDemo";
import { showroomDemoAction } from "./actions";
import styles from "./page.module.css";

export default function ShowroomPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Showroom"
        description="Catálogo dos componentes reutilizáveis em components/ui — principais variantes e estados."
      />

      <div className={styles.stack}>
        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>Button</h2>
            <p className={styles.sectionDescription}>@/components/ui/Button</p>
          </div>
          <Card>
            <div className={styles.row}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="ghostDanger">Ghost danger</Button>
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </Card>
        </section>

        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>SubmitButton</h2>
            <p className={styles.sectionDescription}>
              @/components/ui/SubmitButton — submete um form real para demonstrar o
              estado pendente.
            </p>
          </div>
          <Card>
            <form action={showroomDemoAction} className={styles.row}>
              <SubmitButton pendingText="Enviando...">Enviar</SubmitButton>
            </form>
          </Card>
        </section>

        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>Badge</h2>
            <p className={styles.sectionDescription}>@/components/ui/Badge</p>
          </div>
          <Card>
            <div className={styles.row}>
              <Badge tone="positive">Ativo</Badge>
              <Badge tone="neutral">Inativo</Badge>
            </div>
          </Card>
        </section>

        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>WarningTooltip</h2>
            <p className={styles.sectionDescription}>
              @/components/ui/WarningTooltip — balão de aviso com tooltip exibido ao
              passar o mouse ou focar via teclado.
            </p>
          </div>
          <Card>
            <div className={styles.row}>
              <WarningTooltip message="Complete suas informações de cadastro" />
            </div>
          </Card>
        </section>

        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>Card</h2>
            <p className={styles.sectionDescription}>@/components/ui/Card</p>
          </div>
          <Card>
            <p>Conteúdo de exemplo dentro de um Card.</p>
          </Card>
        </section>

        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>EmptyState</h2>
            <p className={styles.sectionDescription}>@/components/ui/EmptyState</p>
          </div>
          <Card>
            <EmptyState
              title="Nenhum item encontrado"
              description="Descrição de apoio explicando o próximo passo."
              action={<Button size="sm">Ação primária</Button>}
            />
          </Card>
        </section>

        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>PageHeader</h2>
            <p className={styles.sectionDescription}>@/components/ui/PageHeader</p>
          </div>
          <Card>
            <PageHeader
              title="Título da página"
              description="Descrição opcional exibida abaixo do título."
              actions={<Button size="sm">Ação</Button>}
            />
          </Card>
        </section>

        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>PageContainer</h2>
            <p className={styles.sectionDescription}>
              @/components/ui/PageContainer — centraliza o conteúdo com largura
              máxima e espaçamento vertical padrão.
            </p>
          </div>
          <div className={styles.previewFrame}>
            <PageContainer>
              <Card>
                <p>Conteúdo de exemplo dentro de um PageContainer.</p>
              </Card>
            </PageContainer>
          </div>
        </section>

        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>Sidebar</h2>
            <p className={styles.sectionDescription}>
              @/components/ui/Sidebar — navegação principal da aplicação, destaca o
              item ativo e vira uma barra horizontal abaixo de 720px.
            </p>
          </div>
          <div className={styles.previewFrame}>
            <Sidebar
              brand="Logistic"
              items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Produtos", href: "/product" },
              ]}
              footer={
                <Button variant="ghostDanger" size="sm">
                  Logout
                </Button>
              }
            />
          </div>
        </section>

        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>Modal</h2>
            <p className={styles.sectionDescription}>
              @/components/ui/Modal — diálogo nativo (`&lt;dialog&gt;`), com backdrop,
              fechamento por clique fora e tecla Esc.
            </p>
          </div>
          <Card>
            <ModalDemo />
          </Card>
        </section>

        <section className={styles.section}>
          <div>
            <h2 className={styles.sectionTitle}>Drawer</h2>
            <p className={styles.sectionDescription}>
              @/components/ui/Drawer — painel deslizante do lado direito, mesma base
              de `&lt;dialog&gt;` do Modal.
            </p>
          </div>
          <Card>
            <DrawerDemo />
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}
