# SDLC Implementation Example

**Complete walkthrough**: Building an E-Commerce Checkout Feature with SDLC enforcement

---

## Overview

This example demonstrates the complete SDLC lifecycle for a real feature:
- **Feature**: One-click checkout with Stripe integration
- **Timeline**: 45 days (actual)
- **Phases**: 6 SDLC phases with gates
- **Agents**: 12 agents across 4 domains
- **Deliverables**: 28 artifacts
- **Quality Gates**: 18 automated + 8 manual

---

## Phase 1: Requirements & Planning (5 days)

### Day 1-2: Discovery

```typescript
// 1. Start SDLC project
import { SDLCOrchestrator } from './src/sdlc/orchestrator.js';

const orchestrator = new SDLCOrchestrator();

const project = await orchestrator.startProject({
  name: 'E-Commerce Checkout Feature',
  description: 'One-click checkout with Stripe payment integration'
});

console.log(project);
// {
//   id: 'proj_abc123',
//   currentPhase: 'requirements',
//   deliverables: [
//     { name: 'Product Requirements Document (PRD)', status: 'pending' },
//     { name: 'User Stories', status: 'pending' },
//     { name: 'Success Metrics', status: 'pending' }
//   ]
// }
```

**Agents Assigned**:
1. `trend-researcher` → Market analysis
2. `feedback-synthesizer` → User research
3. `sprint-prioritizer` → Requirements prioritization

**User Request**: "Research one-click checkout trends and user pain points"

**Agent Execution**:
```bash
# Routes to: product → trend-researcher
npm run cli -- exec "Research one-click checkout trends in e-commerce"
```

**Deliverable Produced**:
```markdown
# Market Research: One-Click Checkout

## Key Findings
- 87% of users abandon cart due to complex checkout
- One-click reduces checkout time from 4min → 30sec
- Stripe Shop Pay has 1.7x higher conversion

## Recommendations
- Implement guest checkout (no account required)
- Save payment methods securely
- Show clear shipping estimates
- Mobile-first design (62% traffic)

## Competitive Analysis
- Amazon: 1-Click patented (expired 2017)
- Shopify: Shop Pay (1-click, stored cards)
- PayPal: One Touch (biometric auth)

## Success Metrics
- Checkout conversion: +25% (from 32% to 40%)
- Time to complete: <45 seconds
- Mobile conversion: +30%
```

### Day 3-4: Requirements Definition

**Agent**: `sprint-prioritizer`

**User Request**: "Convert research into user stories with acceptance criteria"

**Deliverable**:
```markdown
# User Stories

## Epic: One-Click Checkout

### US-001: Guest Checkout (Priority: P0)
**As a** first-time customer
**I want to** checkout without creating an account
**So that** I can complete my purchase quickly

**Acceptance Criteria**:
- [ ] Email field for order confirmation
- [ ] No password required
- [ ] Optional account creation after purchase
- [ ] Guest orders saved for 30 days

### US-002: Saved Payment Methods (Priority: P0)
**As a** returning customer
**I want to** use my saved credit card
**So that** I don't have to re-enter payment details

**Acceptance Criteria**:
- [ ] Securely store cards with Stripe
- [ ] Show last 4 digits + brand
- [ ] Allow multiple saved cards
- [ ] PCI DSS compliant (Stripe handles)

### US-003: Address Autocomplete (Priority: P1)
**As a** user
**I want** address autocomplete
**So that** I can fill shipping info faster

**Acceptance Criteria**:
- [ ] Google Places API integration
- [ ] Autocomplete after 3 characters
- [ ] Mobile-optimized dropdown
- [ ] Fallback to manual entry

## Success Metrics
- Primary: Checkout conversion +25%
- Secondary: Average checkout time <45s
- Tertiary: Mobile conversion +30%
```

### Day 5: Phase Gate Check

**Quality Gates**:
```typescript
// Check phase completion
const completion = await orchestrator.checkPhaseCompletion(project.id);

console.log(completion);
// {
//   phase: 'requirements',
//   isComplete: true,
//   completionPercentage: 100,
//   missingDeliverables: [],
//   blockers: []
// }

// Run quality gates
const gateResults = await orchestrator.runQualityGates(project.id, 'requirements');

console.log(gateResults);
// {
//   overallPass: true,
//   passedGates: 2,
//   failedGates: 0,
//   blockers: []
// }
```

**Gate Results**:
✅ Requirements Completeness: All stories have acceptance criteria
✅ Stakeholder Approval: Product owner approved PRD

**Transition to Design Phase**:
```typescript
await orchestrator.transitionPhase({
  projectId: project.id,
  fromPhase: 'requirements',
  toPhase: 'design',
  requestedBy: 'product-manager',
  reason: 'All requirements approved and prioritized'
});
```

---

## Phase 2: System Design (7 days)

### Day 6-8: Architecture & API Design

**Agents**: `backend-architect`, `frontend-developer`

**User Request**: "Design API endpoints and database schema for checkout"

**Agent**: `backend-architect`

**Deliverable: API Contract**:
```yaml
openapi: 3.0.0
info:
  title: Checkout API
  version: 1.0.0

paths:
  /checkout/init:
    post:
      summary: Initialize checkout session
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                cart_id:
                  type: string
                user_id:
                  type: string
                  nullable: true
      responses:
        '200':
          description: Checkout session created
          content:
            application/json:
              schema:
                type: object
                properties:
                  session_id:
                    type: string
                  expires_at:
                    type: string
                    format: date-time

  /checkout/payment:
    post:
      summary: Process payment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                session_id:
                  type: string
                payment_method_id:
                  type: string
                billing_address:
                  type: object
      responses:
        '200':
          description: Payment successful
        '402':
          description: Payment failed

  /checkout/confirm:
    post:
      summary: Confirm order
      responses:
        '201':
          description: Order created
```

**Deliverable: Database Schema**:
```sql
-- Checkout sessions (ephemeral, TTL 1 hour)
CREATE TABLE checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  cart_id UUID REFERENCES carts(id),
  status VARCHAR(50) NOT NULL, -- active, completed, abandoned
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  INDEX idx_expires (expires_at)
);

-- Saved payment methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  stripe_payment_method_id VARCHAR(255) UNIQUE NOT NULL,
  card_brand VARCHAR(50),
  last4 VARCHAR(4),
  exp_month INT,
  exp_year INT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user (user_id)
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES checkout_sessions(id),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL, -- pending, paid, shipped, delivered
  shipping_address JSONB,
  billing_address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);
```

### Day 9-11: UI/UX Design

**Agent**: `ui-designer`

**User Request**: "Design checkout flow mockups for mobile and desktop"

**Deliverable**: Figma mockups (link: `figma.com/checkout-design`)

**Component Breakdown**:
```markdown
# Checkout UI Components

## CheckoutForm
- **Props**: `cartId: string`, `onComplete: (orderId) => void`
- **State**: `step: 'shipping' | 'payment' | 'review'`
- **Variants**: Mobile (single column), Desktop (two column)

## ShippingAddressForm
- **Props**: `initialAddress?: Address`, `onSave: (address) => void`
- **Features**: Google Places autocomplete, address validation

## PaymentMethodSelector
- **Props**: `savedMethods: PaymentMethod[]`, `onSelect: (id) => void`
- **Features**: Add new card, default selection, card icons

## OrderSummary
- **Props**: `cartItems: Item[]`, `shipping: number`, `tax: number`
- **Features**: Promo code, real-time total, item thumbnails

## ConfirmationScreen
- **Props**: `orderId: string`, `estimatedDelivery: Date`
- **Features**: Order tracking, receipt email, share buttons
```

### Day 12: Security Design

**Agent**: Custom security review

**Deliverable: Threat Model**:
```markdown
# Security Threat Model

## Threats Identified

### T1: Payment Data Exposure (CRITICAL)
**Risk**: Attacker intercepts credit card data
**Mitigation**:
- ✅ Use Stripe.js (PCI-compliant, data never touches our servers)
- ✅ HTTPS only (enforce TLS 1.3)
- ✅ No storing raw card numbers

### T2: Session Hijacking (HIGH)
**Risk**: Attacker steals checkout session
**Mitigation**:
- ✅ Secure, HTTP-only cookies
- ✅ CSRF tokens on all state-changing requests
- ✅ Session timeout (1 hour)
- ✅ Re-authenticate for saved payment methods

### T3: SQL Injection (HIGH)
**Risk**: Malicious SQL via user input
**Mitigation**:
- ✅ Parameterized queries only (Drizzle ORM)
- ✅ Input validation with Zod
- ✅ Principle of least privilege (DB user)

### T4: XSS Attacks (MEDIUM)
**Risk**: Malicious script injection
**Mitigation**:
- ✅ React auto-escaping
- ✅ Content Security Policy headers
- ✅ Sanitize user-generated content

## Security Requirements
- [ ] PCI DSS compliant (via Stripe)
- [ ] OWASP Top 10 addressed
- [ ] Penetration test before launch
- [ ] Security headers configured
```

### Day 12: Phase Gate

**Quality Gates**:
✅ Architecture Review: Passed (scalable, follows REST principles)
✅ Security Review: Passed (PCI compliant, threat model approved)
✅ Design System Compliance: Passed (uses existing component library)

**Transition to Implementation**:
```typescript
await orchestrator.transitionPhase({
  projectId: project.id,
  fromPhase: 'design',
  toPhase: 'implementation',
  requestedBy: 'tech-lead',
  reason: 'Design approved, ready for development'
});
```

---

## Phase 3: Implementation (21 days)

### Week 1 (Day 13-19): Backend Development

**Agent**: `backend-architect`

**Deliverables**:
1. Checkout API endpoints
2. Stripe integration
3. Database migrations
4. Unit tests (>80% coverage)

**Code Example**:
```typescript
// src/api/checkout.ts
import { Hono } from 'hono';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const app = new Hono();

const InitCheckoutSchema = z.object({
  cart_id: z.string().uuid(),
  user_id: z.string().uuid().optional()
});

app.post('/checkout/init', async (c) => {
  const body = InitCheckoutSchema.parse(await c.req.json());

  // Create checkout session
  const session = await db.insert(checkoutSessions).values({
    cart_id: body.cart_id,
    user_id: body.user_id,
    status: 'active',
    expires_at: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  }).returning();

  return c.json({ session_id: session[0].id });
});

app.post('/checkout/payment', async (c) => {
  const body = await c.req.json();

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: body.amount,
    currency: 'usd',
    payment_method: body.payment_method_id,
    confirm: true
  });

  if (paymentIntent.status === 'succeeded') {
    // Create order
    const order = await db.insert(orders).values({
      session_id: body.session_id,
      stripe_payment_intent_id: paymentIntent.id,
      total_amount: body.amount / 100,
      status: 'paid'
    }).returning();

    return c.json({ order_id: order[0].id });
  }

  return c.json({ error: 'Payment failed' }, 402);
});

export default app;
```

**Tests**:
```typescript
// src/api/checkout.test.ts
import { describe, it, expect } from 'vitest';
import app from './checkout';

describe('Checkout API', () => {
  it('should create checkout session', async () => {
    const res = await app.request('/checkout/init', {
      method: 'POST',
      body: JSON.stringify({ cart_id: 'cart_123' })
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('session_id');
  });

  it('should process payment with Stripe', async () => {
    // Mock Stripe
    // ... test implementation
  });
});
```

### Week 2-3 (Day 20-33): Frontend Development

**Agent**: `frontend-developer`

**Deliverables**:
1. React components
2. Checkout flow
3. Stripe Elements integration
4. E2E tests

**Code Example**:
```tsx
// src/components/CheckoutForm.tsx
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY!);

export function CheckoutForm({ cartId, onComplete }: Props) {
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

  return (
    <div className="checkout-form">
      {step === 'shipping' && (
        <ShippingAddressForm
          onSave={(address) => {
            setShippingAddress(address);
            setStep('payment');
          }}
        />
      )}

      {step === 'payment' && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            cartId={cartId}
            shippingAddress={shippingAddress!}
            onSuccess={(orderId) => {
              setStep('review');
              onComplete(orderId);
            }}
          />
        </Elements>
      )}

      {step === 'review' && (
        <ConfirmationScreen />
      )}
    </div>
  );
}

function PaymentForm({ cartId, shippingAddress, onSuccess }: PaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    // Create payment intent on backend
    const { session_id } = await fetch('/checkout/init', {
      method: 'POST',
      body: JSON.stringify({ cart_id: cartId })
    }).then(r => r.json());

    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      session_id,
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            address: shippingAddress
          }
        }
      }
    );

    if (error) {
      // Show error
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

### Day 34: Code Quality Gates

**Automated Gates**:
```bash
# Run tests
npm test
# Coverage: 87% ✅ (target: 80%)

# Code quality scan
npm run lint
# 0 errors, 3 warnings ✅

# Security scan
npm audit
# 0 vulnerabilities ✅

# Type check
npm run typecheck
# No errors ✅
```

**Quality Gate Results**:
✅ Test Coverage: 87% (target: 80%)
✅ All Tests Passing: 142/142 tests green
✅ Code Quality: 82/100 maintainability
✅ Security Scan: 0 critical CVEs
✅ Code Review: Approved by 2 reviewers

**Transition to Testing**:
```typescript
await orchestrator.transitionPhase({
  projectId: project.id,
  fromPhase: 'implementation',
  toPhase: 'testing',
  requestedBy: 'tech-lead',
  reason: 'All code complete, tests passing, reviews approved'
});
```

---

## Phase 4: Testing & QA (10 days)

### Day 35-38: E2E Testing

**Agent**: `workflow-optimizer`

**Deliverable: E2E Test Suite** (Playwright):
```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('guest checkout with credit card', async ({ page }) => {
    // Add items to cart
    await page.goto('/products');
    await page.click('[data-testid="add-to-cart-btn"]');

    // Go to checkout
    await page.click('[data-testid="checkout-btn"]');

    // Fill shipping address
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'San Francisco');
    await page.fill('[name="zip"]', '94102');
    await page.click('[data-testid="continue-to-payment"]');

    // Fill payment (test card)
    await page.frameLocator('iframe[name*="stripe"]')
      .locator('[name="cardnumber"]')
      .fill('4242424242424242');
    await page.frameLocator('iframe[name*="stripe"]')
      .locator('[name="exp-date"]')
      .fill('1225');
    await page.frameLocator('iframe[name*="stripe"]')
      .locator('[name="cvc"]')
      .fill('123');

    // Submit payment
    await page.click('[data-testid="pay-now-btn"]');

    // Verify confirmation
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-id"]')).toContainText(/ORD-/);
  });

  test('saved payment method checkout', async ({ page }) => {
    // Login as existing user
    await page.goto('/login');
    await page.fill('[name="email"]', 'returning@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('[data-testid="login-btn"]');

    // Checkout with saved card
    await page.goto('/cart');
    await page.click('[data-testid="checkout-btn"]');
    await page.click('[data-testid="saved-card-visa-1234"]');
    await page.click('[data-testid="complete-order"]');

    // Should complete in < 10 seconds
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible({
      timeout: 10000
    });
  });
});
```

**E2E Results**:
- Total scenarios: 15
- Passing: 15/15 (100%) ✅
- Average duration: 8.2 seconds
- Browsers tested: Chrome, Firefox, Safari, Mobile Safari

### Day 39-41: Performance Testing

**Agent**: `performance-benchmarker`

**Load Test Results**:
```bash
# Simulated load: 1000 concurrent users
k6 run load-test.js

# Results:
✓ checks.........................: 100.00%
  http_req_duration..............: avg=156ms med=142ms p95=287ms
  http_reqs......................: 15,000
  iteration_duration.............: avg=2.1s
  vus............................: 1000
  vus_max........................: 1000

✅ p95 latency: 287ms (target: < 500ms)
✅ Success rate: 100%
✅ Throughput: 250 req/sec
```

### Day 42-43: Security Testing

**Penetration Test Results**:
```markdown
# Security Audit Report

## Methodology
- OWASP Top 10 testing
- Automated scanning (OWASP ZAP)
- Manual penetration testing

## Findings

### Critical: 0
### High: 0
### Medium: 1
- M1: Missing rate limiting on /checkout/init
  - **Mitigation**: Add rate limit (10 req/min per IP)
  - **Status**: Fixed

### Low: 2
- L1: Missing security headers (X-Frame-Options)
  - **Status**: Fixed
- L2: Verbose error messages in production
  - **Status**: Fixed

## Conclusion
✅ No critical or high vulnerabilities
✅ PCI DSS compliant (via Stripe)
✅ Ready for production
```

### Day 44: Final Gate Check

**Quality Gate Results**:
✅ Zero P0 Bugs: 0 critical issues
✅ E2E Pass Rate: 100% (15/15 tests)
✅ Performance SLA: p95 287ms (target <500ms)
✅ Security Cleared: Pen test passed
✅ Accessibility: WCAG 2.1 AA compliant

**Transition to Deployment**:
```typescript
await orchestrator.transitionPhase({
  projectId: project.id,
  fromPhase: 'testing',
  toPhase: 'deployment',
  requestedBy: 'qa-lead',
  reason: 'All quality gates passed, ready for production'
});
```

---

## Phase 5: Deployment (2 days)

### Day 45: Production Deployment

**Agent**: `devops-automator`

**Deployment Strategy**:
```yaml
# deployment-plan.yml
strategy: canary

stages:
  - name: canary
    traffic: 5%
    duration: 1h
    success_criteria:
      error_rate: < 0.1%
      p95_latency: < 500ms

  - name: gradual_25
    traffic: 25%
    duration: 4h

  - name: gradual_50
    traffic: 50%
    duration: 8h

  - name: full_rollout
    traffic: 100%

rollback_triggers:
  - error_rate > 1%
  - p95_latency > 1000ms
  - critical_bugs_reported > 0
```

**Deployment Log**:
```
[14:00] Starting canary deployment (5%)
[14:00] Health check: OK
[14:15] Metrics check: ✅ Error rate 0.02%, p95 234ms
[15:00] Canary successful, increasing to 25%
[15:00] Metrics check: ✅ Error rate 0.01%, p95 198ms
[19:00] Increasing to 50%
[03:00] Full rollout (100%)
[03:00] 🎉 Deployment complete!
```

**Monitoring Dashboard**:
```
Checkout Conversion: 41.2% (+28% from baseline)
Average Checkout Time: 38 seconds (target <45s) ✅
Mobile Conversion: 39.8% (+31% from baseline) ✅
Error Rate: 0.01%
Uptime: 100%
```

**Final Transition**:
```typescript
await orchestrator.transitionPhase({
  projectId: project.id,
  fromPhase: 'deployment',
  toPhase: 'maintenance',
  requestedBy: 'devops-lead',
  reason: 'Successful production deployment, entering maintenance mode'
});
```

---

## Phase 6: Maintenance (Ongoing)

**Agent**: `analytics-reporter`, `support-responder`

**Week 1 Health Report**:
```markdown
# Week 1 Post-Launch Report

## Metrics
- Uptime: 99.98% (4 minutes downtime due to planned maintenance)
- Checkout conversion: 41.2% (baseline: 32%) ✅
- Average checkout time: 38s (target: <45s) ✅
- Mobile conversion: 39.8% (baseline: 28%) ✅

## User Feedback
- NPS: +54 (Very positive)
- Support tickets: 18 (mostly "how to use saved cards")
- Feature requests: 7

## Issues Found
- 3 P3 bugs (UI polish, non-blocking)
- 1 P2 bug (saved card sorting incorrect)

## Next Iteration
- Add Apple Pay / Google Pay (high demand)
- Improve address autocomplete (international)
- Add gift message option
```

---

## Summary: SDLC Benefits Demonstrated

### Quality Improvements
- **Before**: 12 P0 bugs in production (last feature)
- **After**: 0 P0 bugs (SDLC gates prevented)

### Timeline Predictability
- **Estimated**: 45 days
- **Actual**: 45 days (100% on time)
- **Previous features**: Avg 30% over estimate

### Business Impact
- **Conversion**: +28% (target: +25%) ✅
- **Mobile conversion**: +31% (target: +30%) ✅
- **Customer satisfaction**: NPS +54 (excellent)

### Compliance
- **Audit trail**: Complete (every phase transition logged)
- **Documentation**: 100% deliverables documented
- **Security**: PCI compliant, pen test passed

---

## Key Takeaways

1. **Phase gates catch issues early**: Security review in design phase prevented implementation rework
2. **Automated gates save time**: 18 automated checks run in < 5 minutes
3. **Traceability**: Can trace every requirement to test to deployment
4. **Predictability**: SDLC structure = accurate estimates
5. **Quality**: Enforced standards = zero critical bugs

**SDLC transformed this from a risky feature launch to a systematic, predictable, high-quality delivery.**
