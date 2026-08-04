import styles from "./PageContainer.module.css";

type PageContainerProps = {
  children: React.ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return <div className={styles.container}>{children}</div>;
}
