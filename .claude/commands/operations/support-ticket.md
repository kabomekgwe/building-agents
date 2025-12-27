# Handle Support Ticket

I need you to investigate, troubleshoot, and resolve a customer support ticket efficiently.

## Context

**Ticket Details**: $ARGUMENTS

(Examples: "User can't log in", "Payment failed error", "Feature not working as expected", "Data export request", "Account deletion request")

## Your Task

Route this to the **support-responder** agent who will:

1. **Ticket Triage**:
   **Severity Classification**:
   - 🔴 **P0 - Critical**: Service down, data loss, security breach, payment failures
     - Response time: < 1 hour
     - Resolution time: < 4 hours
     - Escalate immediately
   - 🟡 **P1 - High**: Core feature broken, multiple users affected, business-critical issue
     - Response time: < 4 hours
     - Resolution time: < 24 hours
   - 🟢 **P2 - Medium**: Feature partially broken, workaround available, single user affected
     - Response time: < 24 hours
     - Resolution time: < 3 days
   - ⚪ **P3 - Low**: Minor issue, cosmetic bug, feature request, general inquiry
     - Response time: < 48 hours
     - Resolution time: Best effort

   **Category**:
   - Technical issue (bug, error, performance)
   - Account issue (login, password, permissions)
   - Billing issue (payment, refund, invoice)
   - Feature request (enhancement, new capability)
   - How-to question (education, onboarding)
   - Feedback/complaint (user experience, product feedback)

2. **Initial Response** (acknowledge within SLA):
   **Response Template**:
   ```
   Hi [User Name],

   Thanks for reaching out! I'm [Your Name] and I'll be helping you with [brief issue description].

   I understand you're experiencing [restate problem in your own words]. That must be frustrating, especially [empathize with impact].

   I'm looking into this now and will have an update for you within [timeframe based on severity].

   In the meantime, [optional: suggest workaround or ask clarifying questions].

   Best,
   [Your Name]
   ```

   **Tone Guidelines**:
   - Empathetic: Acknowledge frustration
   - Personal: Use their name, sign with yours
   - Clear: No jargon, explain in simple terms
   - Solution-oriented: Focus on fixing the problem

3. **Investigation & Diagnosis**:
   **Gather Context**:
   - User details (ID, email, account tier, signup date)
   - Reproduction steps ("What were you trying to do?")
   - Environment (browser, device, OS, network)
   - Screenshots or screen recording (if visual issue)
   - Error messages (exact wording, error codes)

   **Check Common Causes**:
   - User error (misunderstanding feature, wrong workflow)
   - Known issue (already reported, in our bug tracker)
   - Service outage (check status page, monitoring dashboards)
   - Recent deployment (new feature broke something)
   - Data issue (corrupted data, missing record)

   **Technical Debugging** (if needed):
   - Check application logs (filter by user ID, timestamp)
   - Review database records (user data, transactions)
   - Reproduce issue (try to recreate on staging environment)
   - Check third-party services (Stripe, Auth0, Sendgrid status)

4. **Resolution Paths**:
   **Immediate Fix** (user-facing action):
   - Reset password
   - Manually trigger action (resend email, retry payment)
   - Update permissions or settings
   - Provide workaround ("Use feature X instead of Y")

   **Engineering Fix** (requires code change):
   - Create bug ticket (Linear, Jira, GitHub Issues)
   - Include reproduction steps, severity, user impact
   - Assign to appropriate team/engineer
   - Set due date based on severity

   **Product Decision** (feature request or edge case):
   - Log feature request (product backlog)
   - Explain current limitation
   - Offer alternative solution
   - Set expectation (timeline or no timeline)

   **Data Request** (GDPR, account deletion, export):
   - Verify user identity (additional authentication)
   - Follow compliance process (legal team involvement if needed)
   - Provide data within legal timeframe (30 days for GDPR)

5. **Customer Communication**:
   **Resolution Response**:
   ```
   Hi [User Name],

   Great news! I've resolved the issue with [brief description].

   Here's what happened:
   [Explain root cause in simple terms]

   Here's what I did to fix it:
   [Explain solution]

   You should now be able to [expected outcome]. Can you confirm it's working on your end?

   To prevent this in the future, [optional: suggest best practice or provide education].

   Let me know if you have any other questions!

   Best,
   [Your Name]
   ```

   **Escalation Response** (if requires engineering):
   ```
   Hi [User Name],

   Thanks for your patience while I investigated this.

   I've identified the issue: [brief explanation without technical jargon].

   Our engineering team is working on a fix, which will be deployed by [date/timeframe]. I'll keep you updated on the progress.

   In the meantime, here's a workaround you can use: [if available].

   I've added your email to the notification list, so you'll be automatically notified once this is resolved.

   Thanks for bringing this to our attention!

   Best,
   [Your Name]
   ```

   **No Fix Available** (feature limitation, by-design):
   ```
   Hi [User Name],

   Thanks for reaching out about [issue].

   After investigating, I found that [explain limitation or by-design behavior].

   I understand this isn't ideal for your use case. Here are some alternatives you might consider:
   [List 2-3 workarounds or alternative workflows]

   I've also logged this as a feature request for our product team to consider. While I can't guarantee if or when this will be implemented, your feedback helps us prioritize our roadmap.

   Let me know if any of the alternatives work for you, or if you have other questions!

   Best,
   [Your Name]
   ```

6. **Knowledge Base & Self-Service**:
   **Identify Documentation Gaps**:
   - Is this question answered in docs/FAQ? (If not, create article)
   - Could this be prevented with better onboarding?
   - Should this be a product improvement (e.g., better error message)?

   **Create Help Article** (if common question):
   - Title: [Clear, searchable question, e.g., "How do I reset my password?"]
   - Problem: [Describe issue]
   - Solution: [Step-by-step with screenshots]
   - Additional context: [FAQs, tips, related articles]

   **Update Onboarding** (if user confusion):
   - Add tooltip or help text in product
   - Update welcome email or tutorial
   - Create in-app guide (Appcues, Pendo)

7. **Escalation Criteria**:
   **When to Escalate to Engineering**:
   - Bug confirmed (reproducible, not user error)
   - Data corruption or loss
   - Security vulnerability
   - Performance degradation
   - Multiple users reporting same issue

   **When to Escalate to Product**:
   - Feature request with high demand
   - Major UX friction point
   - Competitive gap (competitor has feature we don't)

   **When to Escalate to Leadership**:
   - Angry customer threatening to churn
   - Legal or compliance concern
   - Press/media inquiry
   - Data breach or security incident

8. **Follow-Up & Closure**:
   **Confirm Resolution**:
   - Ask user to verify fix worked
   - Wait for confirmation before closing ticket
   - If no response after 3 days, send follow-up:
     > "Hi [Name], I haven't heard back so I'm assuming this is resolved. I'm closing this ticket, but feel free to reopen if you need further help!"

   **CSAT Survey** (Customer Satisfaction):
   - Send after ticket resolution
   - 1-5 scale: "How satisfied were you with the support you received?"
   - Optional comment: "What could we have done better?"

   **Internal Documentation**:
   - Add resolution to internal knowledge base (private notes)
   - Tag ticket (bug, feature request, user error)
   - Update macros/templates if new pattern emerged

9. **Ticket Metrics**:
   **Track Performance**:
   - **First Response Time** (FRT): Time to initial response (target: < 4 hours)
   - **Time to Resolution** (TTR): Time to close ticket (target: < 24 hours for P1)
   - **Customer Satisfaction (CSAT)**: Survey rating (target: > 4.5/5)
   - **Ticket Volume**: Number of tickets per day/week
   - **Escalation Rate**: % of tickets escalated to engineering (target: < 20%)
   - **Reopened Tickets**: % of tickets reopened (target: < 5%)

   **Identify Trends**:
   - Most common issues (prioritize fixing or documenting)
   - Peak support hours (staff accordingly)
   - Features causing most confusion (product improvements needed)

10. **Proactive Support**:
    **Prevent Future Tickets**:
    - Monitor error logs (fix issues before users report)
    - Update documentation (reduce how-to questions)
    - Improve error messages (make them actionable)
    - Send proactive notifications (planned maintenance, known issues)

    **Feature Launch Support**:
    - Prepare FAQ before launch
    - Train support team on new features
    - Monitor for launch-related issues
    - Create macros for common questions

## Deliverables

- Ticket response (initial acknowledgment, updates, resolution)
- Internal investigation notes (root cause, steps taken)
- Bug report (if engineering fix needed)
- Knowledge base article (if common question)
- CSAT survey response

## Common Ticket Types & Templates

**Login Issues**:
1. Verify email address is correct
2. Check if account exists (search by email)
3. Send password reset link
4. Check for account lockout (too many failed attempts)
5. Verify email deliverability (not in spam)

**Payment Failures**:
1. Check payment method (card expired, declined)
2. Review transaction logs (error codes from Stripe)
3. Retry payment manually (if transient error)
4. Update payment method
5. Escalate to billing team if recurring issue

**Feature Not Working**:
1. Reproduce issue (try on your end)
2. Check user permissions (do they have access to this feature?)
3. Check browser/device compatibility
4. Check for recent deployments (new bug introduced?)
5. Create bug report if confirmed

**Data Export Request**:
1. Verify user identity (additional authentication if sensitive)
2. Generate export (CSV, JSON, or PDF)
3. Send securely (encrypted email, temporary download link)
4. Log request (for compliance tracking)

**Account Deletion Request**:
1. Verify identity (email confirmation, additional auth)
2. Inform of consequences (data loss, can't be undone)
3. Offer alternatives (downgrade, pause subscription)
4. Process deletion (follow GDPR process, 30-day grace period)
5. Send confirmation email

## Success Criteria

- **Fast response**: First response within SLA (< 4 hours for P1)
- **High resolution**: 90% of tickets resolved on first contact
- **Customer satisfaction**: CSAT > 4.5/5
- **Escalation efficiency**: < 20% of tickets escalated to engineering
- **Knowledge capture**: Every common issue has a help article

**Route to**: System Coordinator → Studio Operations Coordinator → support-responder
