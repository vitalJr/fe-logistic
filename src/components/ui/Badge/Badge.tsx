import styles from "./Badge.module.css";

type BadgeProps = {
  tone?: "positive" | "neutral";
  children: React.ReactNode;
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
