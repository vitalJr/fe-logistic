"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Abrir modal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Título do modal">
        <p>Conteúdo de exemplo dentro do Modal.</p>
      </Modal>
    </>
  );
}
