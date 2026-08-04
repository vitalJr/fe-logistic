"use client";

import { useActionState, useEffect, useId, useState } from "react";
import type { Customer } from "@/schemas/customer";
import {
  createExitAction,
  type MovementFormState,
} from "@/app/(app)/stock/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Modal } from "@/components/ui/Modal";
import { Tooltip } from "@/components/ui/Tooltip";
import styles from "./RegisterExitButton.module.css";

const initialState: MovementFormState = { status: "idle" };

function ArrowUpIcon() {
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
      <path d="M12 20V7" />
      <path d="M6 13l6-6 6 6" />
      <path d="M4 4h16" />
    </svg>
  );
}

type ExitFormProps = {
  productId: string;
  productUnit: string;
  currentStock: number;
  customers: Customer[];
  onSuccess: () => void;
};

function ExitForm({
  productId,
  productUnit,
  currentStock,
  customers,
  onSuccess,
}: ExitFormProps) {
  const [state, formAction] = useActionState(
    createExitAction.bind(null, productId),
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
      <p className={styles.stockHint}>
        Estoque disponível: <strong>{currentStock}</strong> {productUnit}
      </p>

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
        <label htmlFor={fieldId("customerId")}>Cliente</label>
        <select id={fieldId("customerId")} name="customerId" defaultValue="">
          <option value="">Sem cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        {fieldErrors.customerId?.map((error) => (
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
          placeholder="Nº de guia/documento"
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
          Registrar saída
        </SubmitButton>
      </div>
    </form>
  );
}

type RegisterExitButtonProps = {
  productId: string;
  productName: string;
  productUnit: string;
  currentStock: number;
  customers: Customer[];
  disabled?: boolean;
};

export function RegisterExitButton({
  productId,
  productName,
  productUnit,
  currentStock,
  customers,
  disabled,
}: RegisterExitButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip label="Registrar saída">
        <button
          type="button"
          className={`${styles.iconButton} ${styles.exit}`}
          onClick={() => setOpen(true)}
          disabled={disabled}
          aria-label={`Registrar saída de ${productName}`}
        >
          <ArrowUpIcon />
        </button>
      </Tooltip>
      {open ? (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={`Saída — ${productName}`}
        >
          <ExitForm
            productId={productId}
            productUnit={productUnit}
            currentStock={currentStock}
            customers={customers}
            onSuccess={() => setOpen(false)}
          />
        </Modal>
      ) : null}
    </>
  );
}
