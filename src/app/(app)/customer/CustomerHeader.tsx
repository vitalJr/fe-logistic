"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClass } from "@/components/ui/Button";

export function CustomerHeader() {
  const pathname = usePathname();

  const isNewCustomer = pathname === "/customer/new";

  const title = isNewCustomer ? "Cadastro de Clientes" : "Clientes";
  const description = isNewCustomer
    ? ""
    : "Gerencie os clientes associados às saídas de stock.";
  const Action = isNewCustomer ? null : (
    <Link href="/customer/new" className={buttonClass("primary")}>
      Adicionar cliente
    </Link>
  );

  return (
    <PageHeader title={title} description={description} actions={Action} />
  );
}
