"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction, type LoginFormState } from "@/app/login/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { buttonClass } from "@/components/ui/Button";
import styles from "./LoginForm.module.css";

const initialState: LoginFormState = { status: "idle" };

interface LoginCredentials {
  email: string;
  password: string;
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={credentials.email}
          onChange={(event) =>
            setCredentials({ ...credentials, email: event.target.value })
          }
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={(event) =>
            setCredentials({ ...credentials, password: event.target.value })
          }
          required
        />
      </div>

      {state.status === "error" && state.message && (
        <p className={styles.error}>{state.message}</p>
      )}

      <SubmitButton pendingText="Entrando...">Entrar</SubmitButton>

      <Link href="/pre-register" className={buttonClass("secondary")}>
        Fazer pré-cadastro
      </Link>
    </form>
  );
}
