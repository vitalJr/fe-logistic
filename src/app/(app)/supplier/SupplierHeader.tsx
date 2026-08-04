"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClass } from "@/components/ui/Button";

export function SupplierHeader() {
  const pathname = usePathname();

  const isNewSupplier = pathname === "/supplier/new";

  const title = isNewSupplier ? "Cadastro de Fornecedores" : "Fornecedores";
  const description = isNewSupplier
    ? ""
    : "Gerencie os fornecedores associados às entradas de stock.";
  const Action = isNewSupplier ? null : (
    <Link href="/supplier/new" className={buttonClass("primary")}>
      Adicionar fornecedor
    </Link>
  );

  return (
    <PageHeader title={title} description={description} actions={Action} />
  );
}
