import { RoleName } from "@mhg/db";
import { requireRouteRole } from "@/lib/route-guard";
import { AuthenticatedShell } from "@/components/authenticated-shell";

const ALLOWED = [RoleName.COMPANY_ADMIN, RoleName.PLATFORM_ADMIN];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role } = await requireRouteRole(ALLOWED);
  return (
    <AuthenticatedShell sectionName="Administration" role={role}>
      {children}
    </AuthenticatedShell>
  );
}
