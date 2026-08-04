"use client";

import { useActionState, useEffect, useId, useState } from "react";
import type { Supplier } from "@/schemas/supplier";
import {
  createEntryAction,
  type MovementFormState,
} from "@/app/(app)/stock/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Modal } from "@/components/ui/Modal";
import { Tooltip } from "@/components/ui/Tooltip";
import styles from "./RegisterEntryButton.module.css";

const initialState: MovementFormState = { status: "idle" };

function ArrowDownIcon() {
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
      <path d="M12 4v13" />
      <path d="M6 11l6 6 6-6" />
      <path d="M4 20h16" />
    </svg>
  );
}

type EntryFormProps = {
  productId: string;
  productUnit: string;
  suppliers: Supplier[];
  onSuccess: () => void;
};

function EntryForm({
  productId,
  productUnit,
  suppliers,
  onSuccess,
}: EntryFormProps) {
  const [state, formAction] = useActionState(
    createEntryAction.bind(null, productId),
    initialState,
  );
  const fieldErrors = state.fieldErrors ?? {};
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

  useEffect(() => {
    if (state.status === "success") {
      onSuccess();
    }
  }, [state.status, onSuccess]);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor={fieldId("quantity")}>Quantidade ({productUnit})</label>
        <input
          id={fieldId("quantity")}
          name="quantity"
          type="number"
          min={0.001}
          step="any"
          required
        />
        {fieldErrors.quantity?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor={fieldId("unitCost")}>
          Custo de compra (por unidade)
        </label>
        <input
          id={fieldId("unitCost")}
          name="unitCost"
          type="number"
          min={0}
          step="0.01"
        />
        {fieldErrors.unitCost?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor={fieldId("supplierId")}>Fornecedor</label>
        <select id={fieldId("supplierId")} name="supplierId" defaultValue="">
          <option value="">Sem fornecedor</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        {fieldErrors.supplierId?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor={fieldId("reference")}>Referência</label>
        <input
          id={fieldId("reference")}
          name="reference"
          type="text"
          maxLength={100}
          placeholder="Nº de guia/fatura"
        />
        {fieldErrors.reference?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor={fieldId("note")}>Nota</label>
        <textarea id={fieldId("note")} name="note" rows={3} maxLength={1000} />
        {fieldErrors.note?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      {state.status === "error" && state.message && (
        <p className={styles.formError}>{state.message}</p>
      )}

      <div className={styles.actions}>
        <SubmitButton pendingText="Registrando...">
          Registrar entrada
        </SubmitButton>
      </div>
    </form>
  );
}

type RegisterEntryButtonProps = {
  productId: string;
  productName: string;
  productUnit: string;
  suppliers: Supplier[];
  disabled?: boolean;
};

export function RegisterEntryButton({
  productId,
  productName,
  productUnit,
  suppliers,
  disabled,
}: RegisterEntryButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip label="Registrar entrada">
        <button
          type="button"
          className={`${styles.iconButton} ${styles.entry}`}
          onClick={() => setOpen(true)}
          disabled={disabled}
          aria-label={`Registrar entrada de ${productName}`}
        >
          <ArrowDownIcon />
        </button>
      </Tooltip>
      {open ? (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={`Entrada — ${productName}`}
        >
          <EntryForm
            productId={productId}
            productUnit={productUnit}
            suppliers={suppliers}
            onSuccess={() => setOpen(false)}
          />
        </Modal>
      ) : null}
    </>
  );
}
