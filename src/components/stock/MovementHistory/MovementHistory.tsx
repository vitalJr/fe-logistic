import Link from "next/link";
import type { StockMovement, MovementType } from "@/schemas/stock";
import type { Product } from "@/schemas/product";
import type { Supplier } from "@/schemas/supplier";
import type { Customer } from "@/schemas/customer";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClass } from "@/components/ui/Button";
import styles from "./MovementHistory.module.css";

const TYPE_LABELS: Record<MovementType, string> = {
  entry: "Entrada",
  exit: "Saída",
  adjustment: "Ajuste",
};

type MovementHistoryProps = {
  movements: StockMovement[];
  products: Product[];
  suppliers: Supplier[];
  customers: Customer[];
  currentUserId: string | null;
  filters: {
    productId: string;
    type: string;
    from: string;
    to: string;
  };
};

function formatQuantity(type: MovementType, quantity: number): string {
  if (type === "entry") return `+${quantity}`;
  if (type === "exit") return `-${quantity}`;
  return quantity > 0 ? `+${quantity}` : `${quantity}`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MovementHistory({
  movements,
  products,
  suppliers,
  customers,
  currentUserId,
  filters,
}: MovementHistoryProps) {
  const productById = new Map(products.map((product) => [product.id, product]));
  const supplierById = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
  const customerById = new Map(customers.map((customer) => [customer.id, customer]));

  return (
    <div className={styles.stack}>
      <Card>
        <form method="GET" className={styles.filters}>
          <div className={styles.field}>
            <label htmlFor="type">Tipo</label>
            <select id="type" name="type" defaultValue={filters.type}>
              <option value="">Todos</option>
              <option value="entry">Entrada</option>
              <option value="exit">Saída</option>
              <option value="adjustment">Ajuste</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="productId">Produto</label>
            <select id="productId" name="productId" defaultValue={filters.productId}>
              <option value="">Todos</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="from">De</label>
            <input id="from" name="from" type="date" defaultValue={filters.from} />
          </div>

          <div className={styles.field}>
            <label htmlFor="to">Até</label>
            <input id="to" name="to" type="date" defaultValue={filters.to} />
          </div>

          <div className={styles.filterActions}>
            <button type="submit" className={buttonClass("primary", "sm")}>
              Filtrar
            </button>
            <Link href="/stock/movements" className={buttonClass("secondary", "sm")}>
              Limpar
            </Link>
          </div>
        </form>
      </Card>

      {movements.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhum movimento encontrado"
            description="Ajuste os filtros ou registre uma entrada, saída ou ajuste no stock."
          />
        </Card>
      ) : (
        <Card className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data/hora</th>
                  <th>Tipo</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Fornecedor/Cliente</th>
                  <th>Referência</th>
                  <th>Usuário</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => {
                  const product = productById.get(movement.productId);
                  const counterparty =
                    movement.supplierId !== undefined
                      ? supplierById.get(movement.supplierId)?.name
                      : movement.customerId !== undefined
                        ? customerById.get(movement.customerId)?.name
                        : undefined;

                  return (
                    <tr key={movement.id}>
                      <td data-label="Data/hora">{formatDateTime(movement.createdAt)}</td>
                      <td data-label="Tipo">
                        <span className={`${styles.typeBadge} ${styles[movement.type]}`}>
                          {TYPE_LABELS[movement.type]}
                        </span>
                      </td>
                      <td data-label="Produto">
                        {product ? `${product.name} (${product.sku})` : movement.productId}
                        {movement.type === "adjustment" && movement.reason && (
                          <div className={styles.reason}>{movement.reason}</div>
                        )}
                      </td>
                      <td data-label="Quantidade" className={styles[movement.type]}>
                        {formatQuantity(movement.type, movement.quantity)}
                      </td>
                      <td data-label="Fornecedor/Cliente">{counterparty || "—"}</td>
                      <td data-label="Referência">{movement.reference || "—"}</td>
                      <td data-label="Usuário" className={styles.user}>
                        {movement.userId === currentUserId ? "Você" : movement.userId}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
