import { RoleName } from "@mhg/db";
import { requireRouteRole } from "@/lib/route-guard";
import { AuthenticatedShell } from "@/components/authenticated-shell";

const ALLOWED = [RoleName.LOAN_OFFICER, RoleName.MANAGER, RoleName.COMPANY_ADMIN, RoleName.PLATFORM_ADMIN];

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const { role } = await requireRouteRole(ALLOWED);
  return (
    <AuthenticatedShell sectionName="CRM" role={role}>
      {children}
    </AuthenticatedShell>
  );
}
