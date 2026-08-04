import Link from "next/link";
import { WarningTooltip } from "@/components/ui/WarningTooltip";
import styles from "./ProfileLink.module.css";

type ProfileLinkProps = {
  registrationIncomplete: boolean;
};

export function ProfileLink({ registrationIncomplete }: ProfileLinkProps) {
  return (
    <Link href="/profile" className={styles.link}>
      <span className={styles.avatar} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7" />
        </svg>
      </span>

      <span className={styles.label}>Perfil</span>

      {registrationIncomplete && (
        <WarningTooltip
          message="Complete suas informações de cadastro"
          label="Cadastro incompleto: complete suas informações de cadastro"
        />
      )}
    </Link>
  );
}
