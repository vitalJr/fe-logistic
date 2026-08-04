"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

export type SidebarItem = {
  label: string;
  href: string;
};

type SidebarProps = {
  brand?: string;
  items: SidebarItem[];
  footer?: React.ReactNode;
};

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ brand, items, footer }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar} aria-label="Navegação principal">
      {brand && <span className={styles.brand}>{brand}</span>}
      <ul className={styles.list}>
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={active ? `${styles.link} ${styles.active}` : styles.link}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {footer && <div className={styles.footer}>{footer}</div>}
    </nav>
  );
}
