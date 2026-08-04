"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {
  productUnitOptions,
  type Product,
  type ProductUnit,
} from "@/schemas/product";
import type { Category } from "@/schemas/category";
import type { ProductFormState } from "@/app/(app)/product/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button, buttonClass } from "@/components/ui/Button";
import styles from "./ProductForm.module.css";

const initialState: ProductFormState = { status: "idle" };

interface ProductFormData {
  name: string;
  sku: string;
  categoryId: string;
  unit: ProductUnit | "";
  minStock: string;
  price: string;
  active: boolean;
}

type ProductFormProps = {
  action: (
    prevState: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  initialValues?: Product;
  categories: Category[];
  submitLabel: string;
  pendingLabel: string;
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ProductForm({
  action,
  initialValues,
  categories,
  submitLabel,
  pendingLabel,
  isEditing = true,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const fieldErrors = state.fieldErrors ?? {};
  const disabled = !isEditing;

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: initialValues?.name ?? "",
    sku: initialValues?.sku ?? "",
    categoryId: initialValues?.categoryId ?? "",
    unit: initialValues?.unit ?? "",
    minStock: String(initialValues?.minStock ?? 0),
    price: String(initialValues?.price ?? 0),
    active: initialValues?.active ?? true,
  });

  useEffect(() => {
    if (state.status === "success") {
      onSuccess?.();
    }
  }, [state.status, onSuccess]);

  return (
    <div className={styles.formShell}>
      <form action={formAction} className={styles.form}>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            value={productForm.name}
            onChange={(event) =>
              setProductForm({ ...productForm, name: event.target.value })
            }
            maxLength={150}
            required
            disabled={disabled}
          />
          {fieldErrors.name?.map((error) => (
            <span key={error} className={styles.fieldError}>
              {error}
            </span>
          ))}
        </div>

        <div className={styles.field}>
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            name="sku"
            type="text"
            value={productForm.sku}
            onChange={(event) =>
              setProductForm({ ...productForm, sku: event.target.value })
            }
            maxLength={50}
            required
            disabled={disabled}
          />
          {fieldErrors.sku?.map((error) => (
            <span key={error} className={styles.fieldError}>
              {error}
            </span>
          ))}
        </div>

        <div className={styles.field}>
          <label htmlFor="categoryId">Categoria</label>
          <select
            id="categoryId"
            name="categoryId"
            value={productForm.categoryId}
            onChange={(event) =>
              setProductForm({ ...productForm, categoryId: event.target.value })
            }
            required
            disabled={disabled}
          >
            <option value="" disabled>
              Selecione
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {fieldErrors.categoryId?.map((error) => (
            <span key={error} className={styles.fieldError}>
              {error}
            </span>
          ))}
        </div>

        <div className={styles.field}>
          <label htmlFor="unit">Unidade</label>
          <select
            id="unit"
            name="unit"
            value={productForm.unit}
            onChange={(event) =>
              setProductForm({
                ...productForm,
                unit: event.target.value as ProductUnit,
              })
            }
            required
            disabled={disabled}
          >
            <option value="" disabled>
              Selecione
            </option>
            {productUnitOptions.map((unitOption) => (
              <option key={unitOption} value={unitOption}>
                {unitOption}
              </option>
            ))}
          </select>
          {fieldErrors.unit?.map((error) => (
            <span key={error} className={styles.fieldError}>
              {error}
            </span>
          ))}
        </div>

        <div className={styles.field}>
          <label htmlFor="minStock">Estoque mínimo</label>
          <input
            id="minStock"
            name="minStock"
            type="number"
            min={0}
            step={1}
            value={productForm.minStock}
            onChange={(event) =>
              setProductForm({ ...productForm, minStock: event.target.value })
            }
            required
            disabled={disabled}
          />
          {fieldErrors.minStock?.map((error) => (
            <span key={error} className={styles.fieldError}>
              {error}
            </span>
          ))}
        </div>

        <div className={styles.field}>
          <label htmlFor="price">Preço</label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step={0.01}
            value={productForm.price}
            onChange={(event) =>
              setProductForm({ ...productForm, price: event.target.value })
            }
            required
            disabled={disabled}
          />
          {fieldErrors.price?.map((error) => (
            <span key={error} className={styles.fieldError}>
              {error}
            </span>
          ))}
        </div>

        <div className={`${styles.field} ${styles.checkboxField} ${styles.fieldFull}`}>
          <input
            id="active"
            name="active"
            type="checkbox"
            checked={productForm.active}
            onChange={(event) =>
              setProductForm({ ...productForm, active: event.target.checked })
            }
            disabled={disabled}
          />
          <label htmlFor="active">Produto ativo</label>
        </div>

        {state.status === "error" && state.message && (
          <p className={styles.formError}>{state.message}</p>
        )}

        {isEditing && (
          <div className={styles.actions}>
            <SubmitButton pendingText={pendingLabel}>{submitLabel}</SubmitButton>
            {onCancel ? (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            ) : (
              <Link href="/product" className={buttonClass("secondary")}>
                Cancelar
              </Link>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
