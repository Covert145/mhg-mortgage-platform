-- Row-Level Security: the multi-tenant isolation backstop.
-- See docs/architecture/security-architecture.md #3.
--
-- RLS policies are invisible to superusers and to a table's owner (unless
-- FORCE ROW LEVEL SECURITY is set, which still exempts superusers). Since
-- migrations run as the database owner, the *application* must connect as a
-- separate, non-superuser role for these policies to actually apply. This
-- migration creates that role.
--
-- Session variable app.current_org_id is set per-request/transaction by
-- withOrgScope() in packages/core/src/scope.ts via
-- `SELECT set_config('app.current_org_id', $1, true)` (parameterized, not
-- string-interpolated). A missing/invalid session variable resolves to
-- NULL via NULLIF(..., ''), which matches no rows -- fail closed, not open.
--
-- Note: id/organizationId columns are Prisma-default TEXT (not native
-- Postgres uuid), so policies compare as text -- no ::uuid cast needed.

-- ---------------------------------------------------------------------------
-- Application role (non-superuser, RLS-subject)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'mhg_app') THEN
    CREATE ROLE mhg_app LOGIN PASSWORD 'mhg_app_dev_password_change_in_production';
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO mhg_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO mhg_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mhg_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO mhg_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO mhg_app;

-- ---------------------------------------------------------------------------
-- Group 1: tables with a direct "organizationId" column
-- ---------------------------------------------------------------------------
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY branches_isolation ON branches USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE org_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_memberships_isolation ON org_memberships USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY contacts_isolation ON contacts USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE partner_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY partner_companies_isolation ON partner_companies USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY partners_isolation ON partners USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY pipelines_isolation ON pipelines USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE stage_automation_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY stage_automation_rules_isolation ON stage_automation_rules USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE loan_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY loan_files_isolation ON loan_files USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE subject_properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY subject_properties_isolation ON subject_properties USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY documents_isolation ON documents USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tasks_isolation ON tasks USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY activities_isolation ON activities USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY opportunities_isolation ON opportunities USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
CREATE POLICY communications_isolation ON communications USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY campaigns_isolation ON campaigns USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_conversations_isolation ON ai_conversations USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_logs_isolation ON audit_logs USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY invites_isolation ON invites USING ("organizationId" = NULLIF(current_setting('app.current_org_id', true), ''));

-- document_types."organizationId" is nullable: NULL rows are shared/global
-- document types visible to every organization; non-null rows are org-specific.
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY document_types_isolation ON document_types USING (
  "organizationId" IS NULL OR "organizationId" = NULLIF(current_setting('app.current_org_id', true), '')
);

-- ---------------------------------------------------------------------------
-- Group 2: tables scoped via a direct "loanFileId" column
-- ---------------------------------------------------------------------------
ALTER TABLE loan_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY loan_terms_isolation ON loan_terms USING (
  EXISTS (SELECT 1 FROM loan_files lf WHERE lf.id = loan_terms."loanFileId" AND lf."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
CREATE POLICY applicants_isolation ON applicants USING (
  EXISTS (SELECT 1 FROM loan_files lf WHERE lf.id = applicants."loanFileId" AND lf."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY conditions_isolation ON conditions USING (
  EXISTS (SELECT 1 FROM loan_files lf WHERE lf.id = conditions."loanFileId" AND lf."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY document_requests_isolation ON document_requests USING (
  EXISTS (SELECT 1 FROM loan_files lf WHERE lf.id = document_requests."loanFileId" AND lf."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE stage_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY stage_history_isolation ON stage_history USING (
  EXISTS (SELECT 1 FROM loan_files lf WHERE lf.id = stage_history."loanFileId" AND lf."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE underwriting_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY underwriting_decisions_isolation ON underwriting_decisions USING (
  EXISTS (SELECT 1 FROM loan_files lf WHERE lf.id = underwriting_decisions."loanFileId" AND lf."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE closing_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY closing_details_isolation ON closing_details USING (
  EXISTS (SELECT 1 FROM loan_files lf WHERE lf.id = closing_details."loanFileId" AND lf."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE other_new_mortgages ENABLE ROW LEVEL SECURITY;
CREATE POLICY other_new_mortgages_isolation ON other_new_mortgages USING (
  EXISTS (
    SELECT 1 FROM loan_terms lt JOIN loan_files lf ON lf.id = lt."loanFileId"
    WHERE lt.id = other_new_mortgages."loanTermsId" AND lf."organizationId" = NULLIF(current_setting('app.current_org_id', true), '')
  )
);

-- ---------------------------------------------------------------------------
-- Group 3: tables scoped via "applicantId" -> applicants."loanFileId"
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW _applicant_org AS
  SELECT a.id AS applicant_id, lf."organizationId" AS organization_id
  FROM applicants a JOIN loan_files lf ON lf.id = a."loanFileId";

ALTER TABLE dependents ENABLE ROW LEVEL SECURITY;
CREATE POLICY dependents_isolation ON dependents USING (
  EXISTS (SELECT 1 FROM _applicant_org ao WHERE ao.applicant_id = dependents."applicantId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE residence_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY residence_history_isolation ON residence_history USING (
  EXISTS (SELECT 1 FROM _applicant_org ao WHERE ao.applicant_id = residence_history."applicantId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE employment ENABLE ROW LEVEL SECURITY;
CREATE POLICY employment_isolation ON employment USING (
  EXISTS (SELECT 1 FROM _applicant_org ao WHERE ao.applicant_id = employment."applicantId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE other_income ENABLE ROW LEVEL SECURITY;
CREATE POLICY other_income_isolation ON other_income USING (
  EXISTS (SELECT 1 FROM _applicant_org ao WHERE ao.applicant_id = other_income."applicantId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY assets_isolation ON assets USING (
  EXISTS (SELECT 1 FROM _applicant_org ao WHERE ao.applicant_id = assets."applicantId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE liabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY liabilities_isolation ON liabilities USING (
  EXISTS (SELECT 1 FROM _applicant_org ao WHERE ao.applicant_id = liabilities."applicantId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE real_estate_owned ENABLE ROW LEVEL SECURITY;
CREATE POLICY real_estate_owned_isolation ON real_estate_owned USING (
  EXISTS (SELECT 1 FROM _applicant_org ao WHERE ao.applicant_id = real_estate_owned."applicantId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE declarations ENABLE ROW LEVEL SECURITY;
CREATE POLICY declarations_isolation ON declarations USING (
  EXISTS (SELECT 1 FROM _applicant_org ao WHERE ao.applicant_id = declarations."applicantId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE military_service ENABLE ROW LEVEL SECURITY;
CREATE POLICY military_service_isolation ON military_service USING (
  EXISTS (SELECT 1 FROM _applicant_org ao WHERE ao.applicant_id = military_service."applicantId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE demographic_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY demographic_info_isolation ON demographic_info USING (
  EXISTS (SELECT 1 FROM _applicant_org ao WHERE ao.applicant_id = demographic_info."applicantId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), ''))
);

GRANT SELECT ON _applicant_org TO mhg_app;

-- ---------------------------------------------------------------------------
-- Group 4: grandchildren of the applicant chain
-- ---------------------------------------------------------------------------
ALTER TABLE self_employment_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY self_employment_details_isolation ON self_employment_details USING (
  EXISTS (
    SELECT 1 FROM employment e JOIN _applicant_org ao ON ao.applicant_id = e."applicantId"
    WHERE e.id = self_employment_details."employmentId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), '')
  )
);

ALTER TABLE gift_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY gift_details_isolation ON gift_details USING (
  EXISTS (
    SELECT 1 FROM assets a JOIN _applicant_org ao ON ao.applicant_id = a."applicantId"
    WHERE a.id = gift_details."assetId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), '')
  )
);

ALTER TABLE demographic_race_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY demographic_race_details_isolation ON demographic_race_details USING (
  EXISTS (
    SELECT 1 FROM demographic_info di JOIN _applicant_org ao ON ao.applicant_id = di."applicantId"
    WHERE di.id = demographic_race_details."demographicInfoId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), '')
  )
);

ALTER TABLE demographic_ethnicity_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY demographic_ethnicity_details_isolation ON demographic_ethnicity_details USING (
  EXISTS (
    SELECT 1 FROM demographic_info di JOIN _applicant_org ao ON ao.applicant_id = di."applicantId"
    WHERE di.id = demographic_ethnicity_details."demographicInfoId" AND ao.organization_id = NULLIF(current_setting('app.current_org_id', true), '')
  )
);

-- ---------------------------------------------------------------------------
-- Group 5: subject property chain
-- ---------------------------------------------------------------------------
ALTER TABLE manufactured_home_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY manufactured_home_details_isolation ON manufactured_home_details USING (
  EXISTS (SELECT 1 FROM subject_properties sp WHERE sp.id = manufactured_home_details."subjectPropertyId" AND sp."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE hud_labels ENABLE ROW LEVEL SECURITY;
CREATE POLICY hud_labels_isolation ON hud_labels USING (
  EXISTS (
    SELECT 1 FROM manufactured_home_details mhd JOIN subject_properties sp ON sp.id = mhd."subjectPropertyId"
    WHERE mhd.id = hud_labels."manufacturedHomeDetailId" AND sp."organizationId" = NULLIF(current_setting('app.current_org_id', true), '')
  )
);

ALTER TABLE park_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY park_details_isolation ON park_details USING (
  EXISTS (
    SELECT 1 FROM manufactured_home_details mhd JOIN subject_properties sp ON sp.id = mhd."subjectPropertyId"
    WHERE mhd.id = park_details."manufacturedHomeDetailId" AND sp."organizationId" = NULLIF(current_setting('app.current_org_id', true), '')
  )
);

-- ---------------------------------------------------------------------------
-- Group 6: document children
-- ---------------------------------------------------------------------------
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY document_versions_isolation ON document_versions USING (
  EXISTS (SELECT 1 FROM documents d WHERE d.id = document_versions."documentId" AND d."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE document_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY document_access_isolation ON document_access USING (
  EXISTS (SELECT 1 FROM documents d WHERE d.id = document_access."documentId" AND d."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE document_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY document_audits_isolation ON document_audits USING (
  EXISTS (SELECT 1 FROM documents d WHERE d.id = document_audits."documentId" AND d."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

-- ---------------------------------------------------------------------------
-- Group 7: pipeline children
-- ---------------------------------------------------------------------------
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY pipeline_stages_isolation ON pipeline_stages USING (
  EXISTS (SELECT 1 FROM pipelines p WHERE p.id = pipeline_stages."pipelineId" AND p."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

-- ---------------------------------------------------------------------------
-- Group 8: campaign children
-- ---------------------------------------------------------------------------
ALTER TABLE campaign_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY campaign_steps_isolation ON campaign_steps USING (
  EXISTS (SELECT 1 FROM campaigns c WHERE c.id = campaign_steps."campaignId" AND c."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE campaign_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY campaign_enrollments_isolation ON campaign_enrollments USING (
  EXISTS (SELECT 1 FROM campaigns c WHERE c.id = campaign_enrollments."campaignId" AND c."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

-- ---------------------------------------------------------------------------
-- Group 9: AI conversation children
-- ---------------------------------------------------------------------------
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_messages_isolation ON ai_messages USING (
  EXISTS (SELECT 1 FROM ai_conversations ac WHERE ac.id = ai_messages."conversationId" AND ac."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

ALTER TABLE ai_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_actions_isolation ON ai_actions USING (
  EXISTS (SELECT 1 FROM ai_conversations ac WHERE ac.id = ai_actions."conversationId" AND ac."organizationId" = NULLIF(current_setting('app.current_org_id', true), ''))
);

-- ---------------------------------------------------------------------------
-- Not RLS-protected: global reference data and cross-org identity tables.
-- Access to these is controlled at the application layer (packages/auth,
-- packages/core), since they are either shared across every organization
-- (roles, permissions, declaration_questions, ai_agents) or must be
-- readable before an organization context exists (users, at login time).
-- organizations itself has no parent scope to filter by; "which orgs can
-- this user see" is enforced via org_memberships in the service layer.
-- ---------------------------------------------------------------------------
