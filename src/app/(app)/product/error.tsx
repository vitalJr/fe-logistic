"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import styles from "./error.module.css";

type ProductErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductError({ error, reset }: ProductErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card>
      <p>{error.message}</p>
      <div className={styles.actions}>
        <Button onClick={reset}>Tentar novamente</Button>
      </div>
    </Card>
  );
}
