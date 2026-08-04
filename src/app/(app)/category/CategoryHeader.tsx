"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClass } from "@/components/ui/Button";

export function CategoryHeader() {
  const pathname = usePathname();

  const isNewCategory = pathname === "/category/new";

  const title = isNewCategory ? "Cadastro de Categorias" : "Categorias";
  const description = isNewCategory
    ? ""
    : "Gerencie as categorias de produtos da operação.";
  const Action = isNewCategory ? null : (
    <Link href="/category/new" className={buttonClass("primary")}>
      Adicionar categoria
    </Link>
  );

  return (
    <PageHeader title={title} description={description} actions={Action} />
  );
}
