-- org_memberships needs to be queryable to *discover* which organizations a
-- user belongs to before any organization context exists (e.g. right after
-- login, before app.current_org_id is ever set) -- the same problem Users/
-- Accounts/Sessions have. RLS as originally written required
-- app.current_org_id to already be set, which made membership discovery
-- impossible. org_memberships therefore moves into the same "identity
-- layer, app-scoped instead of RLS-scoped" bucket as users/accounts/
-- sessions: every membership query in the service layer must explicitly
-- filter by userId (and organizationId where relevant), enforced in code,
-- not by a table-level policy. See docs/architecture/security-architecture.md #3.
DROP POLICY IF EXISTS org_memberships_isolation ON org_memberships;
ALTER TABLE org_memberships DISABLE ROW LEVEL SECURITY;
