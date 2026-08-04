import { redirect } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ProfileLink } from "@/components/auth/ProfileLink/ProfileLink";
import { navItems } from "@/lib/navigation";
import { isAuthenticated, getCurrentUserId } from "@/lib/auth";
import { getUser } from "@/lib/api/users";
import styles from "./layout.module.css";

async function getRegistrationIncomplete(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  try {
    const user = await getUser(userId);
    return user.registrationStatus !== "completed";
  } catch {
    return false;
  }
}

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const registrationIncomplete = await getRegistrationIncomplete();

  return (
    <div className={styles.shell}>
      <Sidebar
        brand="Logistic"
        items={navItems}
        footer={
          <div className={styles.footerActions}>
            <ProfileLink registrationIncomplete={registrationIncomplete} />
            <LogoutButton />
          </div>
        }
      />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
