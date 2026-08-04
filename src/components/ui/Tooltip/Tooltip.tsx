import styles from "./Tooltip.module.css";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ label, children, className }: TooltipProps) {
  return (
    <span className={className ? `${styles.wrapper} ${className}` : styles.wrapper}>
      {children}
      <span className={styles.tooltip} role="tooltip">
        {label}
      </span>
    </span>
  );
}
