import { ConfirmResetForm } from "./confirm-form";

export default async function ConfirmResetPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email, token } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 p-4">
      <ConfirmResetForm email={email ?? ""} token={token ?? ""} />
    </main>
  );
}
