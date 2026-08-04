"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/schemas/product";
import type { Supplier } from "@/schemas/supplier";
import type { Customer } from "@/schemas/customer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { WarningTooltip } from "@/components/ui/WarningTooltip";
import { Tooltip } from "@/components/ui/Tooltip";
import { RegisterEntryButton } from "@/components/stock/RegisterEntryButton/RegisterEntryButton";
import { RegisterExitButton } from "@/components/stock/RegisterExitButton/RegisterExitButton";
import { RegisterAdjustmentButton } from "@/components/stock/RegisterAdjustmentButton/RegisterAdjustmentButton";
import styles from "./StockOverviewList.module.css";

type StockOverviewListProps = {
  products: Product[];
  lowStockCount: number;
  suppliers: Supplier[];
  customers: Customer[];
};

function matchesSearch(product: Product, term: string): boolean {
  const normalized = term.trim().toLowerCase();
  if (normalized === "") return true;

  return (
    product.name.toLowerCase().includes(normalized) ||
    product.sku.toLowerCase().includes(normalized)
  );
}

function HistoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export function StockOverviewList({
  products,
  lowStockCount,
  suppliers,
  customers,
}: StockOverviewListProps) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(
    () => products.filter((product) => matchesSearch(product, search)),
    [products, search],
  );

  if (products.length === 0) {
    return (
      <Card>
        <EmptyState
          title="Nenhum produto cadastrado"
          description="Cadastre produtos no catálogo para começar a movimentar o estoque."
        />
      </Card>
    );
  }

  return (
    <div className={styles.stack}>
      {lowStockCount > 0 && (
        <div className={styles.lowStockBanner}>
          <strong>{lowStockCount}</strong>{" "}
          {lowStockCount === 1
            ? "produto está abaixo do estoque mínimo."
            : "produtos estão abaixo do estoque mínimo."}
        </div>
      )}

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Pesquisar por nome ou SKU..."
            aria-label="Pesquisar produtos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <p className={styles.noResults}>
            Nenhum produto encontrado para &quot;{search}&quot;.
          </p>
        ) : (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nome</th>
                  <th>Unidade</th>
                  <th>Estoque atual</th>
                  <th>Estoque mín.</th>
                  <th>Status</th>
                  <th className={styles.actionsHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isLowStock = product.stockQuantity < product.minStock;
                  return (
                    <tr
                      key={product.id}
                      className={
                        product.active ? undefined : styles.inactiveRow
                      }
                    >
                      <td data-label="SKU" className={styles.sku}>
                        {product.sku}
                      </td>
                      <td data-label="Nome" className={styles.name}>
                        {product.name}
                      </td>
                      <td data-label="Unidade">{product.unit}</td>
                      <td data-label="Estoque atual">
                        <span className={styles.stockValue}>
                          {product.stockQuantity}
                          {isLowStock && (
                            <WarningTooltip message="Abaixo do estoque mínimo" />
                          )}
                        </span>
                      </td>
                      <td data-label="Estoque mín.">{product.minStock}</td>
                      <td data-label="Status">
                        <Badge tone={product.active ? "positive" : "neutral"}>
                          {product.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className={styles.actionsCell}>
                        <RegisterEntryButton
                          productId={product.id}
                          productName={product.name}
                          productUnit={product.unit}
                          suppliers={suppliers}
                          disabled={!product.active}
                        />
                        <RegisterExitButton
                          productId={product.id}
                          productName={product.name}
                          productUnit={product.unit}
                          currentStock={product.stockQuantity}
                          customers={customers}
                          disabled={!product.active}
                        />
                        <RegisterAdjustmentButton
                          productId={product.id}
                          productName={product.name}
                          productUnit={product.unit}
                          currentStock={product.stockQuantity}
                          disabled={!product.active}
                        />
                        <Tooltip label="Ver histórico">
                          <Link
                            href={`/stock/movements?productId=${product.id}`}
                            className={styles.iconLink}
                            aria-label={`Ver histórico de movimentos de ${product.name}`}
                          >
                            <HistoryIcon />
                          </Link>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
