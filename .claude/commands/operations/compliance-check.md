# Run Compliance Audit

I need you to audit our systems, processes, and documentation for regulatory compliance.

## Context

**Compliance Scope**: $ARGUMENTS

(Examples: "GDPR compliance review", "CCPA audit for California users", "SOC 2 Type II preparation", "HIPAA compliance check", "Accessibility audit (WCAG AA)", "Pre-launch legal review")

## Your Task

Route this to the **legal-compliance-checker** agent who will:

1. **Identify Applicable Regulations**:
   **Data Privacy Regulations**:
   - **GDPR** (General Data Protection Regulation): EU users
   - **CCPA/CPRA** (California Consumer Privacy Act): California users
   - **PIPEDA** (Personal Information Protection): Canada
   - **LGPD** (Lei Geral de Proteção de Dados): Brazil
   - **UK GDPR**: UK users (post-Brexit)

   **Industry-Specific Regulations**:
   - **HIPAA** (Health Insurance Portability): Health data (US)
   - **PCI DSS** (Payment Card Industry): Credit card processing
   - **COPPA** (Children's Online Privacy): Under 13 users (US)
   - **FERPA** (Family Educational Rights): Student data (US)
   - **SOX** (Sarbanes-Oxley): Public companies (US)

   **Security & Compliance Frameworks**:
   - **SOC 2 Type II**: Service organization controls
   - **ISO 27001**: Information security management
   - **NIST** (Cybersecurity Framework): US government standard
   - **FedRAMP**: Cloud services for US government

   **Accessibility Standards**:
   - **WCAG 2.1** (Web Content Accessibility Guidelines): Level AA minimum
   - **ADA** (Americans with Disabilities Act): US websites
   - **Section 508**: US federal government websites

2. **GDPR Compliance Checklist**:
   **Lawful Basis for Processing**:
   - [ ] Consent: Freely given, specific, informed, unambiguous
   - [ ] Contract: Necessary to fulfill contract with user
   - [ ] Legal obligation: Required by law
   - [ ] Legitimate interest: Balancing test passed

   **User Rights (Data Subject Rights)**:
   - [ ] **Right to Access**: Users can request copy of their data
   - [ ] **Right to Rectification**: Users can correct inaccurate data
   - [ ] **Right to Erasure** ("Right to be Forgotten"): Users can request deletion
   - [ ] **Right to Data Portability**: Export data in machine-readable format
   - [ ] **Right to Object**: Users can object to processing
   - [ ] **Right to Restrict Processing**: Users can limit how data is used

   **Privacy by Design**:
   - [ ] Data minimization (collect only what's needed)
   - [ ] Purpose limitation (use data only for stated purpose)
   - [ ] Storage limitation (delete data when no longer needed)
   - [ ] Encryption at rest and in transit
   - [ ] Pseudonymization where possible

   **Documentation Required**:
   - [ ] Privacy Policy (clear, accessible, comprehensive)
   - [ ] Cookie Policy (if using cookies)
   - [ ] Data Processing Agreement (DPA) with vendors
   - [ ] Records of Processing Activities (ROPA)
   - [ ] Data Protection Impact Assessment (DPIA) if high-risk processing

   **Breach Notification**:
   - [ ] Breach detection mechanisms in place
   - [ ] Incident response plan documented
   - [ ] Notify supervisory authority within 72 hours
   - [ ] Notify affected users "without undue delay"

3. **CCPA/CPRA Compliance Checklist**:
   **Consumer Rights** (California residents):
   - [ ] **Right to Know**: What personal data is collected, how it's used, who it's shared with
   - [ ] **Right to Delete**: Request deletion of personal data
   - [ ] **Right to Opt-Out**: Opt out of sale of personal data
   - [ ] **Right to Non-Discrimination**: No discrimination for exercising rights

   **Required Disclosures**:
   - [ ] Privacy Policy includes CCPA-specific language
   - [ ] "Do Not Sell My Personal Information" link (if selling data)
   - [ ] "Limit the Use of My Sensitive Personal Information" (CPRA)
   - [ ] Toll-free number or web form for requests

   **Operational Requirements**:
   - [ ] Respond to consumer requests within 45 days
   - [ ] Verify identity before processing requests
   - [ ] Log and track all consumer requests
   - [ ] Train employees on CCPA compliance

4. **SOC 2 Type II Preparation**:
   **Trust Service Criteria** (5 categories):
   - **Security**: Protection against unauthorized access
     - [ ] Access controls (RBAC, MFA)
     - [ ] Encryption (data at rest, in transit)
     - [ ] Vulnerability management (patching, scanning)
     - [ ] Incident response plan

   - **Availability**: System uptime and accessibility
     - [ ] 99.9% uptime SLA
     - [ ] Disaster recovery plan
     - [ ] Redundancy (multi-region, backups)
     - [ ] Monitoring and alerting

   - **Processing Integrity**: Complete, valid, accurate, authorized
     - [ ] Input validation
     - [ ] Error handling and logging
     - [ ] Change management process
     - [ ] Quality assurance

   - **Confidentiality**: Sensitive data protection
     - [ ] Data classification
     - [ ] Encryption
     - [ ] NDAs with employees and vendors
     - [ ] Secure disposal of data

   - **Privacy**: Personal information protection (optional, aligns with GDPR)
     - [ ] Privacy policy
     - [ ] User consent mechanisms
     - [ ] Data minimization
     - [ ] Right to deletion

   **SOC 2 Audit Process**:
   - [ ] Define scope (which systems, services)
   - [ ] Select auditor (CPA firm specialized in SOC 2)
   - [ ] Observation period (typically 6-12 months)
   - [ ] Evidence collection (policies, logs, screenshots)
   - [ ] Audit report (management assertion + auditor opinion)

5. **Accessibility (WCAG 2.1 Level AA) Checklist**:
   **Perceivable**:
   - [ ] Alt text for all images
   - [ ] Captions for videos
   - [ ] Color contrast ratio: 4.5:1 for text, 3:1 for UI
   - [ ] No information conveyed by color alone

   **Operable**:
   - [ ] Keyboard navigation (no mouse required)
   - [ ] Focus indicators visible
   - [ ] No keyboard traps (can Tab out of all elements)
   - [ ] Sufficient time to read and interact

   **Understandable**:
   - [ ] Clear, simple language
   - [ ] Consistent navigation and design
   - [ ] Error messages clear and helpful
   - [ ] Labels for form inputs

   **Robust**:
   - [ ] Valid HTML (passes W3C validator)
   - [ ] ARIA attributes used correctly
   - [ ] Works with screen readers (NVDA, JAWS, VoiceOver)
   - [ ] Works in all major browsers

   **Testing Tools**:
   - Automated: axe DevTools, WAVE, Lighthouse
   - Manual: Keyboard testing, screen reader testing
   - User testing: Real users with disabilities

6. **Security & Data Protection Audit**:
   **Authentication & Access Control**:
   - [ ] Strong password requirements (min 8 chars, uppercase, lowercase, number)
   - [ ] Multi-factor authentication (MFA) available
   - [ ] Role-based access control (RBAC)
   - [ ] Principle of least privilege
   - [ ] Session timeout (idle timeout < 30 min)

   **Data Encryption**:
   - [ ] HTTPS everywhere (no mixed content)
   - [ ] TLS 1.2+ (no SSL, TLS 1.0, TLS 1.1)
   - [ ] Database encryption at rest
   - [ ] Encrypted backups
   - [ ] Secure key management (AWS KMS, HashiCorp Vault)

   **Vulnerability Management**:
   - [ ] Regular security scanning (Snyk, Dependabot)
   - [ ] Dependency updates (patch known vulnerabilities)
   - [ ] Penetration testing (annual or after major changes)
   - [ ] Bug bounty program (HackerOne, Bugcrowd)

   **Logging & Monitoring**:
   - [ ] Audit logs for sensitive actions (login, data access, changes)
   - [ ] Log retention (minimum 90 days, ideally 1 year)
   - [ ] Anomaly detection (failed logins, unusual patterns)
   - [ ] Alerts for security events

7. **Privacy Policy Review**:
   **Required Sections**:
   - [ ] What data we collect (personal info, usage data, cookies)
   - [ ] How we collect data (forms, cookies, third-party sources)
   - [ ] Why we collect data (purposes: provide service, analytics, marketing)
   - [ ] Who we share data with (vendors, partners, legal obligations)
   - [ ] How we protect data (encryption, access controls)
   - [ ] User rights (access, delete, opt-out, portability)
   - [ ] How to exercise rights (email, web form, toll-free number)
   - [ ] Data retention (how long we keep data)
   - [ ] International transfers (if transferring data outside EU/US)
   - [ ] Cookies and tracking (what cookies we use, how to disable)
   - [ ] Children's privacy (if applicable, COPPA compliance)
   - [ ] Changes to policy (how users will be notified)
   - [ ] Contact information (DPO if required, privacy email)

   **Plain Language Requirement**:
   - [ ] No legal jargon (readable by average user)
   - [ ] Short paragraphs and bullet points
   - [ ] Examples where helpful
   - [ ] Table of contents for easy navigation

8. **Vendor & Third-Party Risk Assessment**:
   **Vendor Inventory**:
   - List all vendors processing user data (SaaS tools, APIs, cloud providers)
   - Examples: Stripe (payments), SendGrid (email), AWS (hosting), Analytics tools

   **Vendor Due Diligence**:
   - [ ] Data Processing Agreement (DPA) signed
   - [ ] Vendor's security certifications (SOC 2, ISO 27001)
   - [ ] Vendor's privacy policy reviewed
   - [ ] Vendor's data retention and deletion policies
   - [ ] Vendor's breach notification process

   **Sub-Processors**:
   - [ ] List of sub-processors documented
   - [ ] Contractual right to audit sub-processors
   - [ ] Sub-processor changes communicated to customers

9. **Employee Training & Awareness**:
   **Security Training** (annual, mandatory):
   - [ ] Phishing awareness (how to spot phishing emails)
   - [ ] Password security (password managers, no reuse)
   - [ ] Social engineering defense
   - [ ] Incident reporting (who to contact, what to do)

   **Privacy Training**:
   - [ ] GDPR/CCPA basics (user rights, lawful basis)
   - [ ] Data handling best practices (minimization, encryption)
   - [ ] Breach response (notification timelines, escalation)

   **Compliance Training**:
   - [ ] Industry-specific regulations (HIPAA, PCI DSS if applicable)
   - [ ] Company policies (acceptable use, code of conduct)

10. **Audit Report & Remediation**:
    **Audit Findings Classification**:
    - 🔴 **Critical**: High risk, immediate action required (e.g., missing encryption, no DPA)
    - 🟡 **High**: Important, fix within 30 days (e.g., weak password policy, missing privacy policy section)
    - 🟢 **Medium**: Should fix, within 90 days (e.g., incomplete documentation, minor accessibility issues)
    - ⚪ **Low**: Nice to have, best practice (e.g., additional logging, enhanced monitoring)

    **Remediation Plan**:
    ```
    | Finding | Severity | Owner | Due Date | Status |
    |---------|----------|-------|----------|--------|
    | No DPA with Stripe | Critical | Legal | 2025-01-15 | In Progress |
    | Privacy policy missing CCPA language | High | Legal | 2025-02-01 | Not Started |
    | Keyboard navigation broken on checkout | Medium | Frontend | 2025-02-15 | Not Started |
    ```

    **Compliance Roadmap**:
    - Q1: Critical and high findings resolved
    - Q2: Medium findings resolved, SOC 2 audit kickoff
    - Q3: SOC 2 observation period (6 months)
    - Q4: SOC 2 audit completion, ongoing maintenance

## Deliverables

- Compliance audit report (findings, risk assessment)
- Gap analysis (what's missing, what needs improvement)
- Remediation plan (prioritized action items, owners, timelines)
- Updated documentation (privacy policy, DPA templates, policies)
- Training materials (for employees, if needed)
- Compliance dashboard (ongoing monitoring, certifications)

## Compliance Maintenance (Ongoing):
   **Quarterly Reviews**:
   - [ ] Review vendor list (new vendors, terminated vendors)
   - [ ] Review access controls (revoke access for departing employees)
   - [ ] Review privacy policy (any changes needed?)
   - [ ] Review incident logs (any unreported breaches?)

   **Annual Reviews**:
   - [ ] Full compliance audit (GDPR, CCPA, SOC 2)
   - [ ] Penetration testing
   - [ ] Employee training refresh
   - [ ] Policy updates

   **Change Management**:
   - [ ] New features reviewed for privacy impact (DPIA if high-risk)
   - [ ] New vendors vetted for security and privacy
   - [ ] Product changes communicated to users (if affecting privacy)

## Success Criteria

- **No critical findings**: All critical compliance gaps resolved
- **Certifications obtained**: SOC 2, ISO 27001 (if applicable)
- **User rights honored**: 100% of data requests fulfilled within SLA
- **No regulatory fines**: Zero fines or penalties
- **Continuous improvement**: Quarterly compliance reviews completed

## Compliance Resources

**Regulations**: GDPR.eu, CCPA official site, HIPAA.gov
**Frameworks**: SOC 2 (AICPA), ISO 27001, NIST CSF
**Tools**: OneTrust (privacy management), Vanta (compliance automation)
**Legal**: Consult with data privacy attorney for complex issues

**Route to**: System Coordinator → Studio Operations Coordinator → legal-compliance-checker
