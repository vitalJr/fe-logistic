"use client";

import { useEffect, useRef } from "react";
import styles from "./Drawer.module.css";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
};

export function Drawer({ open, onClose, title, headerActions, children }: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.drawer}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          dialogRef.current?.close();
        }
      }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.headerActions}>
          {headerActions}
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
      </div>
      <div className={styles.body}>{children}</div>
    </dialog>
  );
}
