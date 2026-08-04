"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClass } from "@/components/ui/Button";

export function StockHeader() {
  const pathname = usePathname();

  const isMovements = pathname === "/stock/movements";

  if (isMovements) {
    return (
      <PageHeader
        title="Histórico de movimentos"
        description="Consulte todas as entradas, saídas e ajustes de stock registrados."
        actions={
          <Link href="/stock" className={buttonClass("secondary")}>
            Voltar ao stock
          </Link>
        }
      />
    );
  }

  return (
    <PageHeader
      title="Stock"
      description="Consulte o estoque atual e registre entradas, saídas e ajustes."
      actions={
        <Link href="/stock/movements" className={buttonClass("secondary")}>
          Histórico de movimentos
        </Link>
      }
    />
  );
}
