"use client";

import { useState, useTransition } from "react";
import { deleteProductAction } from "@/app/(app)/product/actions";
import { Button, buttonClass } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import styles from "./DeleteProductButton.module.css";

type DeleteProductButtonProps = {
  id: string;
  productName: string;
};

export function DeleteProductButton({ id, productName }: DeleteProductButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button type="button" className={buttonClass("danger", "sm")} onClick={() => setOpen(true)}>
        Remover
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Remover produto">
        <p className={styles.message}>
          Tem certeza que deseja remover o produto <strong>&quot;{productName}&quot;</strong>?
          Essa ação não pode ser desfeita.
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
          <Button
            variant="danger"
            size="sm"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                await deleteProductAction(id);
                setOpen(false);
              });
            }}
          >
            {isPending ? "Removendo..." : "Confirmar remoção"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
