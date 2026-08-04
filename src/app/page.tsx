import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import styles from "./page.module.css";

const features = [
  {
    title: "Catálogo de produtos",
    description:
      "Cadastre, edite e organize todo o catálogo em um só lugar, com SKU, unidade e estoque mínimo.",
  },
  {
    title: "Operação centralizada",
    description:
      "Acompanhe a operação logística em um painel único, pensado para o dia a dia do time.",
  },
  {
    title: "Feito para crescer",
    description:
      "Uma base sólida que evolui junto com a operação, com novas páginas chegando com frequência.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={`${styles.orb} ${styles.orbOne}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles.orbTwo}`} aria-hidden="true" />

      <nav className={styles.nav}>
        <span className={styles.brand}>Logistic</span>
        <Link href="/login" className={buttonClass("secondary")}>
          Entrar
        </Link>
      </nav>

      <section className={styles.hero}>
        <span className={styles.eyebrow}>Gestão logística, simplificada</span>
        <h1 className={styles.title}>Sua operação, sob controle.</h1>
        <p className={styles.description}>
          O Logistic centraliza o catálogo de produtos e a operação da sua empresa em um
          único sistema — rápido, organizado e feito para crescer junto com o seu negócio.
        </p>
        <div className={styles.actions}>
          <Link href="/login" className={buttonClass("primary")}>
            Entrar no sistema
          </Link>
          <Link href="/pre-register" className={buttonClass("secondary")}>
            Fazer pré-cadastro
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        {features.map((feature) => (
          <div key={feature.title} className={styles.feature}>
            <div className={styles.featureIcon} aria-hidden="true">
              ✦
            </div>
            <h2 className={styles.featureTitle}>{feature.title}</h2>
            <p className={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </section>

      <footer className={styles.footer}>© {new Date().getFullYear()} Logistic</footer>
    </div>
  );
}
