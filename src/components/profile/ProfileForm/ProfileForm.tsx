"use client";

import { useActionState, useState } from "react";
import type { User, Cargo, Company } from "@/schemas/user";
import type { ProfileFormState } from "@/app/(app)/profile/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/Button";
import styles from "./ProfileForm.module.css";

const initialState: ProfileFormState = { status: "idle" };

function fieldClass(value: string, ...extra: string[]): string {
  const classes = [styles.field, ...extra];
  if (value.trim() === "") classes.push(styles.warning);
  return classes.join(" ");
}

type ProfileFormProps = {
  action: (
    prevState: ProfileFormState,
    formData: FormData,
  ) => Promise<ProfileFormState>;
  user: User;
  cargos: Cargo[];
  companies: Company[];
};

export function ProfileForm({ action, user, cargos, companies }: ProfileFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const fieldErrors = state.fieldErrors ?? {};

  const [isEditing, setIsEditing] = useState(false);

  const [identificationDocument, setIdentificationDocument] = useState(
    user.identificationDocument ?? "",
  );
  const [cargoId, setCargoId] = useState(user.cargoId ?? "");
  const [companyId, setCompanyId] = useState(user.companyId ?? "");

  function cancelEditing() {
    setIdentificationDocument(user.identificationDocument ?? "");
    setCargoId(user.cargoId ?? "");
    setCompanyId(user.companyId ?? "");
    setIsEditing(false);
  }

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Dados do pré-cadastro</h2>

        <div className={fieldClass(user.name, styles.fieldFull)}>
          <label htmlFor="name">Nome</label>
          <input id="name" type="text" value={user.name} disabled />
        </div>

        <div className={fieldClass(user.birthDate)}>
          <label htmlFor="birthDate">Data de nascimento</label>
          <input id="birthDate" type="text" value={user.birthDate} disabled />
        </div>

        <div className={fieldClass(user.phone)}>
          <label htmlFor="phone">Contato</label>
          <input id="phone" type="text" value={user.phone} disabled />
        </div>

        <div className={fieldClass(user.email)}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={user.email} disabled />
        </div>

        <div className={fieldClass(user.address.street, styles.fieldFull)}>
          <label htmlFor="street">Rua</label>
          <input id="street" type="text" value={user.address.street} disabled />
        </div>

        <div className={fieldClass(user.address.number)}>
          <label htmlFor="number">Número</label>
          <input id="number" type="text" value={user.address.number} disabled />
        </div>

        <div className={fieldClass(user.address.zipCode)}>
          <label htmlFor="zipCode">CEP</label>
          <input id="zipCode" type="text" value={user.address.zipCode} disabled />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Completar cadastro</h2>

        <div className={fieldClass(identificationDocument)}>
          <label htmlFor="identificationDocument">Documento de identificação</label>
          <input
            id="identificationDocument"
            name="identificationDocument"
            type="text"
            maxLength={50}
            value={identificationDocument}
            onChange={(event) => setIdentificationDocument(event.target.value)}
            required
            disabled={!isEditing}
          />
          {fieldErrors.identificationDocument?.map((error) => (
            <span key={error} className={styles.fieldError}>
              {error}
            </span>
          ))}
        </div>

        <div className={fieldClass(cargoId)}>
          <label htmlFor="cargoId">Cargo</label>
          <select
            id="cargoId"
            name="cargoId"
            value={cargoId}
            onChange={(event) => setCargoId(event.target.value)}
            required
            disabled={!isEditing}
          >
            <option value="" disabled>
              Selecione
            </option>
            {cargos.map((cargo) => (
              <option key={cargo.id} value={cargo.id}>
                {cargo.name}
              </option>
            ))}
          </select>
          {fieldErrors.cargoId?.map((error) => (
            <span key={error} className={styles.fieldError}>
              {error}
            </span>
          ))}
        </div>

        <div className={fieldClass(companyId)}>
          <label htmlFor="companyId">Empresa</label>
          <select
            id="companyId"
            name="companyId"
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            required
            disabled={!isEditing}
          >
            <option value="" disabled>
              Selecione
            </option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          {fieldErrors.companyId?.map((error) => (
            <span key={error} className={styles.fieldError}>
              {error}
            </span>
          ))}
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p className={styles.formError}>{state.message}</p>
      )}

      <div className={styles.actions}>
        {isEditing ? (
          <>
            <SubmitButton pendingText="Salvando...">Salvar</SubmitButton>
            <Button type="button" variant="secondary" onClick={cancelEditing}>
              Cancelar
            </Button>
          </>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        )}
      </div>
    </form>
  );
}
