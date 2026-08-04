import styles from "./Card.module.css";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={className ? `${styles.card} ${className}` : styles.card}>
      {children}
    </div>
  );
}
