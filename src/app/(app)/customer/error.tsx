"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import styles from "./error.module.css";

type CustomerErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CustomerError({ error, reset }: CustomerErrorProps) {
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
