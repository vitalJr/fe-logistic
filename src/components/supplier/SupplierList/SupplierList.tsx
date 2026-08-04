"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Supplier } from "@/schemas/supplier";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, buttonClass } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { SupplierForm } from "@/components/supplier/SupplierForm/SupplierForm";
import { ToggleSupplierActiveButton } from "@/components/supplier/ToggleSupplierActiveButton/ToggleSupplierActiveButton";
import { updateSupplierAction } from "@/app/(app)/supplier/actions";
import styles from "./SupplierList.module.css";

type SupplierListProps = {
  suppliers: Supplier[];
};

function matchesSearch(supplier: Supplier, term: string): boolean {
  const normalized = term.trim().toLowerCase();
  if (normalized === "") return true;

  return (
    supplier.name.toLowerCase().includes(normalized) ||
    (supplier.taxId?.toLowerCase().includes(normalized) ?? false)
  );
}

export function SupplierList({ suppliers }: SupplierListProps) {
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredSuppliers = useMemo(
    () => suppliers.filter((supplier) => matchesSearch(supplier, search)),
    [suppliers, search],
  );

  function openView(supplier: Supplier) {
    setSelectedSupplier(supplier);
    setIsEditing(false);
  }

  function openEdit(supplier: Supplier) {
    setSelectedSupplier(supplier);
    setIsEditing(true);
  }

  function closeDrawer() {
    setSelectedSupplier(null);
    setIsEditing(false);
  }

  if (suppliers.length === 0) {
    return (
      <Card>
        <EmptyState
          title="Nenhum fornecedor cadastrado"
          description="Comece adicionando o primeiro fornecedor."
          action={
            <Link href="/supplier/new" className={buttonClass("primary", "sm")}>
              Adicionar fornecedor
            </Link>
          }
        />
      </Card>
    );
  }

  return (
    <>
      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Pesquisar por nome ou NIF..."
            aria-label="Pesquisar fornecedores"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {filteredSuppliers.length === 0 ? (
          <p className={styles.noResults}>
            Nenhum fornecedor encontrado para &quot;{search}&quot;.
          </p>
        ) : (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>NIF</th>
                  <th>Pessoa de contacto</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th className={styles.actionsHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className={supplier.active ? undefined : styles.inactiveRow}
                    onClick={() => openView(supplier)}
                  >
                    <td data-label="Nome" className={styles.name}>
                      {supplier.name}
                    </td>
                    <td data-label="NIF">{supplier.taxId || "—"}</td>
                    <td data-label="Pessoa de contacto">
                      {supplier.contactPerson || "—"}
                    </td>
                    <td data-label="Telefone">{supplier.phone || "—"}</td>
                    <td data-label="Status">
                      <Badge tone={supplier.active ? "positive" : "neutral"}>
                        {supplier.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td
                      className={styles.actionsCell}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        className={styles.editLink}
                        onClick={() => openEdit(supplier)}
                      >
                        Editar
                      </button>
                      <ToggleSupplierActiveButton
                        id={supplier.id}
                        supplierName={supplier.name}
                        active={supplier.active}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Drawer
        open={selectedSupplier !== null}
        onClose={closeDrawer}
        title="Editar fornecedor"
        headerActions={
          !isEditing ? (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          ) : undefined
        }
      >
        {selectedSupplier && (
          <SupplierForm
            action={updateSupplierAction.bind(null, selectedSupplier.id)}
            initialValues={selectedSupplier}
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
