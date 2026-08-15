-- Same reasoning as org_membership_identity_lookup: accepting an invite is
-- a public, unauthenticated flow (a brand-new user has no session and no
-- organization context yet) that must look an Invite up by its token alone.
-- The random 256-bit token itself is the access-control artifact here (a
-- bearer credential), not organization context -- a caller who doesn't
-- already possess the exact token cannot discover or enumerate invites for
-- any organization, since every lookup in the service layer filters on the
-- unique token column, never lists invites without one. Expiry and
-- single-use (status transition to ACCEPTED) are enforced in
-- packages/core/src/services/invite.ts. See
-- docs/architecture/security-architecture.md #3.
DROP POLICY IF EXISTS invites_isolation ON invites;
ALTER TABLE invites DISABLE ROW LEVEL SECURITY;
