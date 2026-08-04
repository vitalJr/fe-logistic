"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import type { Supplier } from "@/schemas/supplier";
import type { SupplierFormState } from "@/app/(app)/supplier/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button, buttonClass } from "@/components/ui/Button";
import styles from "./SupplierForm.module.css";

const initialState: SupplierFormState = { status: "idle" };

interface SupplierFormData {
  name: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  note: string;
  active: boolean;
}

type SupplierFormProps = {
  action: (
    prevState: SupplierFormState,
    formData: FormData,
  ) => Promise<SupplierFormState>;
  initialValues?: Supplier;
  submitLabel: string;
  pendingLabel: string;
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function SupplierForm({
  action,
  initialValues,
  submitLabel,
  pendingLabel,
  isEditing = true,
  onSuccess,
  onCancel,
}: SupplierFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const fieldErrors = state.fieldErrors ?? {};
  const disabled = !isEditing;

  const [supplierForm, setSupplierForm] = useState<SupplierFormData>({
    name: initialValues?.name ?? "",
    taxId: initialValues?.taxId ?? "",
    contactPerson: initialValues?.contactPerson ?? "",
    email: initialValues?.email ?? "",
    phone: initialValues?.phone ?? "",
    address: initialValues?.address ?? "",
    paymentTerms: initialValues?.paymentTerms ?? "",
    note: initialValues?.note ?? "",
    active: initialValues?.active ?? true,
  });

  useEffect(() => {
    if (state.status === "success") {
      onSuccess?.();
    }
  }, [state.status, onSuccess]);

  return (
    <form action={formAction} className={styles.form}>
      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          name="name"
          type="text"
          value={supplierForm.name}
          onChange={(event) =>
            setSupplierForm({ ...supplierForm, name: event.target.value })
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
        <label htmlFor="taxId">Identificação fiscal (NIF)</label>
        <input
          id="taxId"
          name="taxId"
          type="text"
          value={supplierForm.taxId}
          onChange={(event) =>
            setSupplierForm({ ...supplierForm, taxId: event.target.value })
          }
          maxLength={30}
          disabled={disabled}
        />
        {fieldErrors.taxId?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="contactPerson">Pessoa de contacto</label>
        <input
          id="contactPerson"
          name="contactPerson"
          type="text"
          value={supplierForm.contactPerson}
          onChange={(event) =>
            setSupplierForm({ ...supplierForm, contactPerson: event.target.value })
          }
          maxLength={150}
          disabled={disabled}
        />
        {fieldErrors.contactPerson?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={supplierForm.email}
          onChange={(event) =>
            setSupplierForm({ ...supplierForm, email: event.target.value })
          }
          disabled={disabled}
        />
        {fieldErrors.email?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Telefone</label>
        <input
          id="phone"
          name="phone"
          type="text"
          value={supplierForm.phone}
          onChange={(event) =>
            setSupplierForm({ ...supplierForm, phone: event.target.value })
          }
          maxLength={30}
          disabled={disabled}
        />
        {fieldErrors.phone?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="paymentTerms">Condições de pagamento</label>
        <input
          id="paymentTerms"
          name="paymentTerms"
          type="text"
          value={supplierForm.paymentTerms}
          onChange={(event) =>
            setSupplierForm({ ...supplierForm, paymentTerms: event.target.value })
          }
          maxLength={150}
          placeholder="Ex.: 30 dias"
          disabled={disabled}
        />
        {fieldErrors.paymentTerms?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="address">Morada</label>
        <input
          id="address"
          name="address"
          type="text"
          value={supplierForm.address}
          onChange={(event) =>
            setSupplierForm({ ...supplierForm, address: event.target.value })
          }
          maxLength={300}
          disabled={disabled}
        />
        {fieldErrors.address?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="note">Nota</label>
        <textarea
          id="note"
          name="note"
          rows={4}
          maxLength={1000}
          value={supplierForm.note}
          onChange={(event) =>
            setSupplierForm({ ...supplierForm, note: event.target.value })
          }
          disabled={disabled}
        />
        {fieldErrors.note?.map((error) => (
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
          checked={supplierForm.active}
          onChange={(event) =>
            setSupplierForm({ ...supplierForm, active: event.target.checked })
          }
          disabled={disabled}
        />
        <label htmlFor="active">Fornecedor ativo</label>
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
            <Link href="/supplier" className={buttonClass("secondary")}>
              Cancelar
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
