"use client";

import { useState, useTransition } from "react";
import { setSupplierActiveAction } from "@/app/(app)/supplier/actions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Tooltip } from "@/components/ui/Tooltip";
import styles from "./ToggleSupplierActiveButton.module.css";

type ToggleSupplierActiveButtonProps = {
  id: string;
  supplierName: string;
  active: boolean;
};

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5" />
    </svg>
  );
}

function BanIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M6.3 6.3l11.4 11.4" />
    </svg>
  );
}

export function ToggleSupplierActiveButton({
  id,
  supplierName,
  active,
}: ToggleSupplierActiveButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function activate() {
    startTransition(async () => {
      await setSupplierActiveAction(id, true);
    });
  }

  function deactivate() {
    startTransition(async () => {
      await setSupplierActiveAction(id, false);
      setOpen(false);
    });
  }

  if (!active) {
    return (
      <Tooltip label={isPending ? "Ativando..." : "Ativar"}>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.activate}`}
          disabled={isPending}
          onClick={activate}
          aria-label={isPending ? "Ativando fornecedor..." : "Ativar fornecedor"}
        >
          <CheckCircleIcon />
        </button>
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip label="Desativar">
        <button
          type="button"
          className={`${styles.iconButton} ${styles.deactivate}`}
          onClick={() => setOpen(true)}
          aria-label="Desativar fornecedor"
        >
          <BanIcon />
        </button>
      </Tooltip>
      <Modal open={open} onClose={() => setOpen(false)} title="Desativar fornecedor">
        <p className={styles.message}>
          Tem certeza que deseja desativar o fornecedor{" "}
          <strong>&quot;{supplierName}&quot;</strong>? Ele deixará de aparecer como
          opção para novas entradas de stock, mas pode ser reativado a qualquer
          momento.
        </p>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" size="sm" disabled={isPending} onClick={deactivate}>
            {isPending ? "Desativando..." : "Confirmar desativação"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
