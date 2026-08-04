"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import type { Customer } from "@/schemas/customer";
import type { CustomerFormState } from "@/app/(app)/customer/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button, buttonClass } from "@/components/ui/Button";
import styles from "./CustomerForm.module.css";

const initialState: CustomerFormState = { status: "idle" };

interface CustomerFormData {
  name: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  note: string;
  active: boolean;
}

type CustomerFormProps = {
  action: (
    prevState: CustomerFormState,
    formData: FormData,
  ) => Promise<CustomerFormState>;
  initialValues?: Customer;
  submitLabel: string;
  pendingLabel: string;
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CustomerForm({
  action,
  initialValues,
  submitLabel,
  pendingLabel,
  isEditing = true,
  onSuccess,
  onCancel,
}: CustomerFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const fieldErrors = state.fieldErrors ?? {};
  const disabled = !isEditing;

  const [customerForm, setCustomerForm] = useState<CustomerFormData>({
    name: initialValues?.name ?? "",
    taxId: initialValues?.taxId ?? "",
    contactPerson: initialValues?.contactPerson ?? "",
    email: initialValues?.email ?? "",
    phone: initialValues?.phone ?? "",
    deliveryAddress: initialValues?.deliveryAddress ?? "",
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
          value={customerForm.name}
          onChange={(event) =>
            setCustomerForm({ ...customerForm, name: event.target.value })
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
          value={customerForm.taxId}
          onChange={(event) =>
            setCustomerForm({ ...customerForm, taxId: event.target.value })
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
          value={customerForm.contactPerson}
          onChange={(event) =>
            setCustomerForm({ ...customerForm, contactPerson: event.target.value })
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
          value={customerForm.email}
          onChange={(event) =>
            setCustomerForm({ ...customerForm, email: event.target.value })
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
          value={customerForm.phone}
          onChange={(event) =>
            setCustomerForm({ ...customerForm, phone: event.target.value })
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

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="deliveryAddress">Morada de entrega</label>
        <input
          id="deliveryAddress"
          name="deliveryAddress"
          type="text"
          value={customerForm.deliveryAddress}
          onChange={(event) =>
            setCustomerForm({ ...customerForm, deliveryAddress: event.target.value })
          }
          maxLength={300}
          disabled={disabled}
        />
        {fieldErrors.deliveryAddress?.map((error) => (
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
          value={customerForm.note}
          onChange={(event) =>
            setCustomerForm({ ...customerForm, note: event.target.value })
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
          checked={customerForm.active}
          onChange={(event) =>
            setCustomerForm({ ...customerForm, active: event.target.checked })
          }
          disabled={disabled}
        />
        <label htmlFor="active">Cliente ativo</label>
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
            <Link href="/customer" className={buttonClass("secondary")}>
              Cancelar
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
