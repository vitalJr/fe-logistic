import styles from "./WarningTooltip.module.css";

type WarningTooltipProps = {
  message: string;
  label?: string;
  className?: string;
};

export function WarningTooltip({ message, label, className }: WarningTooltipProps) {
  return (
    <span
      className={className ? `${styles.wrapper} ${className}` : styles.wrapper}
      tabIndex={0}
      aria-label={label ?? message}
    >
      <span className={styles.badge} aria-hidden="true">
        !
      </span>
      <span className={styles.tooltip} aria-hidden="true">
        {message}
      </span>
    </span>
  );
}
