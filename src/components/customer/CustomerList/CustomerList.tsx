"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Customer } from "@/schemas/customer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, buttonClass } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { CustomerForm } from "@/components/customer/CustomerForm/CustomerForm";
import { ToggleCustomerActiveButton } from "@/components/customer/ToggleCustomerActiveButton/ToggleCustomerActiveButton";
import { updateCustomerAction } from "@/app/(app)/customer/actions";
import styles from "./CustomerList.module.css";

type CustomerListProps = {
  customers: Customer[];
};

function matchesSearch(customer: Customer, term: string): boolean {
  const normalized = term.trim().toLowerCase();
  if (normalized === "") return true;

  return (
    customer.name.toLowerCase().includes(normalized) ||
    (customer.taxId?.toLowerCase().includes(normalized) ?? false)
  );
}

export function CustomerList({ customers }: CustomerListProps) {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredCustomers = useMemo(
    () => customers.filter((customer) => matchesSearch(customer, search)),
    [customers, search],
  );

  function openView(customer: Customer) {
    setSelectedCustomer(customer);
    setIsEditing(false);
  }

  function openEdit(customer: Customer) {
    setSelectedCustomer(customer);
    setIsEditing(true);
  }

  function closeDrawer() {
    setSelectedCustomer(null);
    setIsEditing(false);
  }

  if (customers.length === 0) {
    return (
      <Card>
        <EmptyState
          title="Nenhum cliente cadastrado"
          description="Comece adicionando o primeiro cliente."
          action={
            <Link href="/customer/new" className={buttonClass("primary", "sm")}>
              Adicionar cliente
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
            aria-label="Pesquisar clientes"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {filteredCustomers.length === 0 ? (
          <p className={styles.noResults}>
            Nenhum cliente encontrado para &quot;{search}&quot;.
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
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className={customer.active ? undefined : styles.inactiveRow}
                    onClick={() => openView(customer)}
                  >
                    <td data-label="Nome" className={styles.name}>
                      {customer.name}
                    </td>
                    <td data-label="NIF">{customer.taxId || "—"}</td>
                    <td data-label="Pessoa de contacto">
                      {customer.contactPerson || "—"}
                    </td>
                    <td data-label="Telefone">{customer.phone || "—"}</td>
                    <td data-label="Status">
                      <Badge tone={customer.active ? "positive" : "neutral"}>
                        {customer.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td
                      className={styles.actionsCell}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        className={styles.editLink}
                        onClick={() => openEdit(customer)}
                      >
                        Editar
                      </button>
                      <ToggleCustomerActiveButton
                        id={customer.id}
                        customerName={customer.name}
                        active={customer.active}
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
        open={selectedCustomer !== null}
        onClose={closeDrawer}
        title="Editar cliente"
        headerActions={
          !isEditing ? (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          ) : undefined
        }
      >
        {selectedCustomer && (
          <CustomerForm
            action={updateCustomerAction.bind(null, selectedCustomer.id)}
            initialValues={selectedCustomer}
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
