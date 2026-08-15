import { redirect } from "next/navigation";
import { auth } from "@mhg/auth";

export default async function HomePage() {
  const session = await auth();
  redirect(session ? "/post-login" : "/login");
}
