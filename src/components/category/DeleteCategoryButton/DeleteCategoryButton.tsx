"use client";

import { useState, useTransition } from "react";
import { deleteCategoryAction } from "@/app/(app)/category/actions";
import { Button, buttonClass } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import styles from "./DeleteCategoryButton.module.css";

type DeleteCategoryButtonProps = {
  id: string;
  categoryName: string;
};

export function DeleteCategoryButton({ id, categoryName }: DeleteCategoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button type="button" className={buttonClass("danger", "sm")} onClick={() => setOpen(true)}>
        Remover
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Remover categoria">
        <p className={styles.message}>
          Tem certeza que deseja remover a categoria <strong>&quot;{categoryName}&quot;</strong>?
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
                await deleteCategoryAction(id);
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
