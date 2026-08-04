export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Categorias", href: "/category" },
  { label: "Produtos", href: "/product" },
  { label: "Stock", href: "/stock" },
  { label: "Fornecedores", href: "/supplier" },
  { label: "Clientes", href: "/customer" },
];
