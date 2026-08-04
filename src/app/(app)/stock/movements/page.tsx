import { getMovements } from "@/lib/api/stock";
import { getProducts } from "@/lib/api/products";
import { getSuppliers } from "@/lib/api/suppliers";
import { getCustomers } from "@/lib/api/customers";
import { getCurrentUserId } from "@/lib/auth";
import { MovementHistory } from "@/components/stock/MovementHistory/MovementHistory";
import type { MovementType } from "@/schemas/stock";

type StockMovementsPageProps = {
  searchParams: Promise<{
    productId?: string;
    type?: string;
    from?: string;
    to?: string;
  }>;
};

const MOVEMENT_TYPES: MovementType[] = ["entry", "exit", "adjustment"];

function isMovementType(value: string | undefined): value is MovementType {
  return MOVEMENT_TYPES.includes(value as MovementType);
}

function toStartOfDayIso(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toISOString();
}

function toEndOfDayIso(date: string): string {
  return new Date(`${date}T23:59:59.999Z`).toISOString();
}

export default async function StockMovementsPage({
  searchParams,
}: StockMovementsPageProps) {
  const params = await searchParams;
  const type = isMovementType(params.type) ? params.type : undefined;

  const [movements, products, suppliers, customers, currentUserId] = await Promise.all([
    getMovements({
      productId: params.productId || undefined,
      type,
      from: params.from ? toStartOfDayIso(params.from) : undefined,
      to: params.to ? toEndOfDayIso(params.to) : undefined,
    }),
    getProducts(),
    getSuppliers(),
    getCustomers(),
    getCurrentUserId(),
  ]);

  return (
    <MovementHistory
      movements={movements}
      products={products}
      suppliers={suppliers}
      customers={customers}
      currentUserId={currentUserId}
      filters={{
        productId: params.productId ?? "",
        type: params.type ?? "",
        from: params.from ?? "",
        to: params.to ?? "",
      }}
    />
  );
}
