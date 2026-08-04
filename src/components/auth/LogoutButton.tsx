"use client";

import { useState } from "react";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SubmitButton } from "@/components/ui/SubmitButton";
import styles from "./LogoutButton.module.css";

export function LogoutButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className={styles.logoutButton}
        variant="ghostDanger"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Logout
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Logout">
        <p className={styles.message}>
          Tem certeza que deseja sair? Você precisará entrar novamente para
          acessar o sistema.
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <form action={logoutAction}>
            <SubmitButton variant="danger" size="sm" pendingText="Saindo...">
              Confirmar logout
            </SubmitButton>
          </form>
        </div>
      </Modal>
    </>
  );
}
