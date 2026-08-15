import { RoleName } from "@mhg/db";
import { requireRouteRole } from "@/lib/route-guard";
import { AuthenticatedShell } from "@/components/authenticated-shell";

const ALLOWED = [RoleName.PROCESSOR, RoleName.MANAGER, RoleName.COMPANY_ADMIN, RoleName.PLATFORM_ADMIN];

export default async function ProcessingLayout({ children }: { children: React.ReactNode }) {
  const { role } = await requireRouteRole(ALLOWED);
  return (
    <AuthenticatedShell sectionName="Processing" role={role}>
      {children}
    </AuthenticatedShell>
  );
}
