"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category } from "@/schemas/category";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, buttonClass } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { DeleteCategoryButton } from "@/components/category/DeleteCategoryButton/DeleteCategoryButton";
import { CategoryForm } from "@/components/category/CategoryForm/CategoryForm";
import { updateCategoryAction } from "@/app/(app)/category/actions";
import styles from "./CategoryList.module.css";

type CategoryListProps = {
  categories: Category[];
};

export function CategoryList({ categories }: CategoryListProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  function openView(category: Category) {
    setSelectedCategory(category);
    setIsEditing(false);
  }

  function openEdit(category: Category) {
    setSelectedCategory(category);
    setIsEditing(true);
  }

  function closeDrawer() {
    setSelectedCategory(null);
    setIsEditing(false);
  }

  if (categories.length === 0) {
    return (
      <Card>
        <EmptyState
          title="Nenhuma categoria cadastrada"
          description="Comece adicionando a primeira categoria ao catálogo."
          action={
            <Link href="/category/new" className={buttonClass("primary", "sm")}>
              Adicionar categoria
            </Link>
          }
        />
      </Card>
    );
  }

  return (
    <>
      <Card className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Status</th>
                <th className={styles.actionsHeader}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className={category.active ? undefined : styles.inactiveRow}
                  onClick={() => openView(category)}
                >
                  <td data-label="Nome" className={styles.name}>
                    {category.name}
                  </td>
                  <td data-label="Descrição">{category.description || "—"}</td>
                  <td data-label="Status">
                    <Badge tone={category.active ? "positive" : "neutral"}>
                      {category.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td
                    className={styles.actionsCell}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      className={styles.editLink}
                      onClick={() => openEdit(category)}
                    >
                      Editar
                    </button>
                    <DeleteCategoryButton id={category.id} categoryName={category.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer
        open={selectedCategory !== null}
        onClose={closeDrawer}
        title="Editar categoria"
        headerActions={
          !isEditing ? (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          ) : undefined
        }
      >
        {selectedCategory && (
          <CategoryForm
            action={updateCategoryAction.bind(null, selectedCategory.id)}
            initialValues={selectedCategory}
            submitLabel="Salvar alterações"
            pendingLabel="Salvando..."
            isEditing={isEditing}
            onSuccess={closeDrawer}
            onCancel={closeDrawer}
          />
        )}
      </Drawer>
    </>
  );
}
