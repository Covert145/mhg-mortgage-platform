import { RoleName } from "@mhg/db";
import { requireRouteRole } from "@/lib/route-guard";
import { AuthenticatedShell } from "@/components/authenticated-shell";

const ALLOWED = [RoleName.BORROWER];

export default async function BorrowerPortalLayout({ children }: { children: React.ReactNode }) {
  const { role } = await requireRouteRole(ALLOWED);
  return (
    <AuthenticatedShell sectionName="Borrower Portal" role={role}>
      {children}
    </AuthenticatedShell>
  );
}
