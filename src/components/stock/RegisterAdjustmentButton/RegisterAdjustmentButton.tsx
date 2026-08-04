"use client";

import { useActionState, useEffect, useId, useState } from "react";
import {
  createAdjustmentAction,
  type MovementFormState,
} from "@/app/(app)/stock/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Modal } from "@/components/ui/Modal";
import { Tooltip } from "@/components/ui/Tooltip";
import styles from "./RegisterAdjustmentButton.module.css";

const initialState: MovementFormState = { status: "idle" };

function SlidersIcon() {
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
      <line x1="4" y1="8" x2="20" y2="8" />
      <circle cx="14" cy="8" r="2" fill="currentColor" stroke="none" />
      <line x1="4" y1="16" x2="20" y2="16" />
      <circle cx="10" cy="16" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

type AdjustmentFormProps = {
  productId: string;
  productUnit: string;
  currentStock: number;
  onSuccess: () => void;
};

function AdjustmentForm({
  productId,
  productUnit,
  currentStock,
  onSuccess,
}: AdjustmentFormProps) {
  const [state, formAction] = useActionState(
    createAdjustmentAction.bind(null, productId),
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
        Estoque atual: <strong>{currentStock}</strong> {productUnit}
      </p>

      <div className={styles.field}>
        <label htmlFor={fieldId("direction")}>Direção</label>
        <select
          id={fieldId("direction")}
          name="direction"
          defaultValue="increase"
        >
          <option value="increase">Aumentar estoque</option>
          <option value="decrease">Diminuir estoque</option>
        </select>
      </div>

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
        <label htmlFor={fieldId("reason")}>Motivo</label>
        <input
          id={fieldId("reason")}
          name="reason"
          type="text"
          maxLength={200}
          placeholder="Ex.: quebra, erro de contagem, produto danificado"
          required
        />
        {fieldErrors.reason?.map((error) => (
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
          Registrar ajuste
        </SubmitButton>
      </div>
    </form>
  );
}

type RegisterAdjustmentButtonProps = {
  productId: string;
  productName: string;
  productUnit: string;
  currentStock: number;
  disabled?: boolean;
};

export function RegisterAdjustmentButton({
  productId,
  productName,
  productUnit,
  currentStock,
  disabled,
}: RegisterAdjustmentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip label="Registrar ajuste">
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setOpen(true)}
          disabled={disabled}
          aria-label={`Registrar ajuste de estoque de ${productName}`}
        >
          <SlidersIcon />
        </button>
      </Tooltip>
      {open ? (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={`Ajuste — ${productName}`}
        >
          <AdjustmentForm
            productId={productId}
            productUnit={productUnit}
            currentStock={currentStock}
            onSuccess={() => setOpen(false)}
          />
        </Modal>
      ) : null}
    </>
  );
}
