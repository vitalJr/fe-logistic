"use client";

import { useFormStatus } from "react-dom";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function SubmitButton({
  children,
  pendingText,
  variant = "primary",
  size = "md",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={buttonClass(variant, size)}>
      {pending ? (pendingText ?? children) : children}
    </button>
  );
}
