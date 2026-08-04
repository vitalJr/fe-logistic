"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/schemas/product";
import type { Category } from "@/schemas/category";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, buttonClass } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { DeleteProductButton } from "@/components/product/DeleteProductButton/DeleteProductButton";
import { ProductForm } from "@/components/product/ProductForm/ProductForm";
import { updateProductAction } from "@/app/(app)/product/actions";
import styles from "./ProductList.module.css";

type ProductListProps = {
  products: Product[];
  categories: Category[];
};

export function ProductList({ products, categories }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  function openView(product: Product) {
    setSelectedProduct(product);
    setIsEditing(false);
  }

  function openEdit(product: Product) {
    setSelectedProduct(product);
    setIsEditing(true);
  }

  function closeDrawer() {
    setSelectedProduct(null);
    setIsEditing(false);
  }

  if (products.length === 0) {
    return (
      <Card>
        <EmptyState
          title="Nenhum produto cadastrado"
          description="Comece adicionando o primeiro produto ao catálogo."
          action={
            <Link href="/product/new" className={buttonClass("primary", "sm")}>
              Adicionar produto
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
                <th>SKU</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Unidade</th>
                <th>Estoque mín.</th>
                <th>Status</th>
                <th className={styles.actionsHeader}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={product.active ? undefined : styles.inactiveRow}
                  onClick={() => openView(product)}
                >
                  <td data-label="SKU" className={styles.sku}>
                    {product.sku}
                  </td>
                  <td data-label="Nome" className={styles.name}>
                    {product.name}
                  </td>
                  <td data-label="Categoria">{product.categoryId}</td>
                  <td data-label="Unidade">{product.unit}</td>
                  <td data-label="Estoque mín.">{product.minStock}</td>
                  <td data-label="Status">
                    <Badge tone={product.active ? "positive" : "neutral"}>
                      {product.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td
                    className={styles.actionsCell}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      className={styles.editLink}
                      onClick={() => openEdit(product)}
                    >
                      Editar
                    </button>
                    <DeleteProductButton id={product.id} productName={product.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer
        open={selectedProduct !== null}
        onClose={closeDrawer}
        title="Editar produto"
        headerActions={
          !isEditing ? (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          ) : undefined
        }
      >
        {selectedProduct && (
          <ProductForm
            action={updateProductAction.bind(null, selectedProduct.id)}
            initialValues={selectedProduct}
            categories={categories}
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
