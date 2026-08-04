"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/schemas/category";
import type { CategoryFormState } from "@/app/(app)/category/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button, buttonClass } from "@/components/ui/Button";
import styles from "./CategoryForm.module.css";

const initialState: CategoryFormState = { status: "idle" };

interface CategoryFormData {
  name: string;
  description: string;
  active: boolean;
}

type CategoryFormProps = {
  action: (
    prevState: CategoryFormState,
    formData: FormData,
  ) => Promise<CategoryFormState>;
  initialValues?: Category;
  submitLabel: string;
  pendingLabel: string;
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CategoryForm({
  action,
  initialValues,
  submitLabel,
  pendingLabel,
  isEditing = true,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const fieldErrors = state.fieldErrors ?? {};
  const disabled = !isEditing;

  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    active: initialValues?.active ?? true,
  });

  useEffect(() => {
    if (state.status === "success") {
      onSuccess?.();
    }
  }, [state.status, onSuccess]);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          name="name"
          type="text"
          value={categoryForm.name}
          onChange={(event) =>
            setCategoryForm({ ...categoryForm, name: event.target.value })
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
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={500}
          value={categoryForm.description}
          onChange={(event) =>
            setCategoryForm({ ...categoryForm, description: event.target.value })
          }
          disabled={disabled}
        />
        {fieldErrors.description?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={`${styles.field} ${styles.checkboxField}`}>
        <input
          id="active"
          name="active"
          type="checkbox"
          checked={categoryForm.active}
          onChange={(event) =>
            setCategoryForm({ ...categoryForm, active: event.target.checked })
          }
          disabled={disabled}
        />
        <label htmlFor="active">Categoria ativa</label>
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
            <Link href="/category" className={buttonClass("secondary")}>
              Cancelar
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
