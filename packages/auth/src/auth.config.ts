import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/nodemailer";
import { z } from "zod";
// Raw prisma import is allowed here — see packages/config's
// no-unscoped-prisma rule: packages/auth is a deliberate exception because
// the Auth.js adapter operates on global identity tables (User/Account/
// Session), which are not organization-scoped and must be queryable before
// any org context exists (e.g. looking a user up by email at login).
import { prisma } from "@mhg/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Auth.js v5 configuration. Session strategy is "database" (not JWT-only)
 * so a revoked session takes effect immediately — see
 * docs/architecture/security-architecture.md #1.
 */
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.hashedPassword) return null;

        const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatches) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    // Magic-link login. In Phase 1 this uses a dev-mode console transport —
    // no real email provider is wired up yet (see
    // docs/architecture/phase-1-implementation-spec.md #14/#16). Swapping in
    // Resend/Postmark in Phase 5 only requires changing sendVerificationRequest.
    Email({
      from: "no-reply@dev.mhg.internal",
      sendVerificationRequest: async ({ identifier, url }) => {
        // eslint-disable-next-line no-console
        console.log(`[dev-email] Magic link for ${identifier}: ${url}`);
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
