"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  preRegisterAction,
  type PreRegisterFormState,
} from "@/app/pre-register/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { buttonClass } from "@/components/ui/Button";
import styles from "./PreRegisterForm.module.css";

const initialState: PreRegisterFormState = { status: "idle" };

interface PreRegistration {
  name: string;
  birthDate: string;
  street: string;
  number: string;
  zipCode: string;
  contact: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function PreRegisterForm() {
  const [state, formAction] = useActionState(preRegisterAction, initialState);
  const fieldErrors = state.fieldErrors ?? {};

  const [preRegistration, setPreRegistration] = useState<PreRegistration>({
    name: "",
    birthDate: "",
    street: "",
    number: "",
    zipCode: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <form action={formAction} className={styles.form}>
      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={150}
          value={preRegistration.name}
          onChange={(event) =>
            setPreRegistration({ ...preRegistration, name: event.target.value })
          }
          required
        />
        {fieldErrors.name?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="birthDate">Data de nascimento</label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          value={preRegistration.birthDate}
          onChange={(event) =>
            setPreRegistration({
              ...preRegistration,
              birthDate: event.target.value,
            })
          }
          required
        />
        {fieldErrors.birthDate?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label htmlFor="street">Rua</label>
        <input
          id="street"
          name="street"
          type="text"
          maxLength={200}
          value={preRegistration.street}
          onChange={(event) =>
            setPreRegistration({
              ...preRegistration,
              street: event.target.value,
            })
          }
          required
        />
        {fieldErrors.street?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="number">Número</label>
        <input
          id="number"
          name="number"
          type="text"
          maxLength={20}
          value={preRegistration.number}
          onChange={(event) =>
            setPreRegistration({
              ...preRegistration,
              number: event.target.value,
            })
          }
          required
        />
        {fieldErrors.number?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="zipCode">CEP</label>
        <input
          id="zipCode"
          name="zipCode"
          type="text"
          maxLength={20}
          value={preRegistration.zipCode}
          onChange={(event) =>
            setPreRegistration({
              ...preRegistration,
              zipCode: event.target.value,
            })
          }
          required
        />
        {fieldErrors.zipCode?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact">Contato</label>
        <input
          id="contact"
          name="contact"
          type="text"
          maxLength={50}
          value={preRegistration.contact}
          onChange={(event) =>
            setPreRegistration({
              ...preRegistration,
              contact: event.target.value,
            })
          }
          required
        />
        {fieldErrors.contact?.map((error) => (
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
          value={preRegistration.email}
          onChange={(event) =>
            setPreRegistration({
              ...preRegistration,
              email: event.target.value,
            })
          }
          required
        />
        {fieldErrors.email?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={preRegistration.password}
          onChange={(event) =>
            setPreRegistration({
              ...preRegistration,
              password: event.target.value,
            })
          }
          required
        />
        {fieldErrors.password?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmPassword">Confirmar senha</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={preRegistration.confirmPassword}
          onChange={(event) =>
            setPreRegistration({
              ...preRegistration,
              confirmPassword: event.target.value,
            })
          }
          required
        />
        {fieldErrors.confirmPassword?.map((error) => (
          <span key={error} className={styles.fieldError}>
            {error}
          </span>
        ))}
      </div>

      {state.status === "error" && state.message && (
        <p className={styles.formError}>{state.message}</p>
      )}

      <div className={styles.actions}>
        <SubmitButton pendingText="Enviando...">Solicitar acesso</SubmitButton>
        <Link href="/login" className={buttonClass("secondary")}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
