import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import styles from "./page.module.css";

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/dashboard");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.brand}>Logistic</span>
        <Card>
          <div className={styles.cardBody}>
            <div>
              <h1 className={styles.title}>Entrar</h1>
              <p className={styles.description}>Acesse o sistema com suas credenciais.</p>
            </div>
            <LoginForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
