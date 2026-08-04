"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";

export function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Abrir drawer
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Título do drawer">
        <p>Conteúdo de exemplo dentro do Drawer.</p>
      </Drawer>
    </>
  );
}
