"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import styles from "./error.module.css";

type CategoryErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CategoryError({ error, reset }: CategoryErrorProps) {
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
