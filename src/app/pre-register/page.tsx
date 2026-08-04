import { Card } from "@/components/ui/Card";
import { PreRegisterForm } from "@/components/auth/PreRegisterForm";
import styles from "./page.module.css";

export default function PreRegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.brand}>Logistic</span>
        <Card>
          <div className={styles.cardBody}>
            <div>
              <h1 className={styles.title}>Pré-cadastro</h1>
              <p className={styles.description}>
                Preencha seus dados para solicitar acesso ao sistema.
              </p>
            </div>
            <PreRegisterForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
