import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { getUser } from "@/lib/api/users";
import { getCargos } from "@/lib/api/cargos";
import { getCompanies } from "@/lib/api/companies";
import { Card } from "@/components/ui/Card";
import { ProfileForm } from "@/components/profile/ProfileForm/ProfileForm";
import { completeRegisterAction } from "./actions";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const [user, cargos, companies] = await Promise.all([
    getUser(userId),
    getCargos(),
    getCompanies(),
  ]);

  return (
    <Card>
      <ProfileForm
        action={completeRegisterAction.bind(null, user.id)}
        user={user}
        cargos={cargos}
        companies={companies}
      />
    </Card>
  );
}
