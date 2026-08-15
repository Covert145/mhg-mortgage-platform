import { Badge } from "@mhg/ui";
import { RoleName } from "@mhg/db";
import { logoutAction } from "@/lib/actions";

const ROLE_LABEL: Record<RoleName, string> = {
  [RoleName.PLATFORM_ADMIN]: "Platform Admin",
  [RoleName.COMPANY_ADMIN]: "Company Admin",
  [RoleName.MANAGER]: "Manager",
  [RoleName.LOAN_OFFICER]: "Loan Officer",
  [RoleName.PROCESSOR]: "Processor",
  [RoleName.BORROWER]: "Borrower",
  [RoleName.REALTOR_PARTNER]: "Realtor / Partner",
};

export function AuthenticatedShell({
  sectionName,
  role,
  children,
}: {
  sectionName: string;
  role: RoleName;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-50">
      <header className="flex items-center justify-between border-b border-ink-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-semibold text-brand-700">Mobile Home Guy</span>
          <span className="text-sm text-ink-400">/</span>
          <span className="text-sm font-medium text-ink-700">{sectionName}</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="brand">{ROLE_LABEL[role]}</Badge>
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-ink-500 hover:text-ink-800 hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
