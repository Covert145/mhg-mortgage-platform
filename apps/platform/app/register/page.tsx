import { RegisterForm } from "./register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <RegisterForm token={token ?? ""} />;
}
