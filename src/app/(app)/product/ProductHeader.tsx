"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClass } from "@/components/ui/Button";

export function ProductHeader() {
  const pathname = usePathname();

  const isNewProduct = pathname === "/product/new";

  const title = isNewProduct ? "Cadastro de Produtos" : "Produtos";
  const description = isNewProduct
    ? ""
    : "Gerencie o catálogo de produtos da operação.";
  const Action = isNewProduct ? null : (
    <Link href="/product/new" className={buttonClass("primary")}>
      Adicionar produto
    </Link>
  );

  return (
    <PageHeader title={title} description={description} actions={Action} />
  );
}
