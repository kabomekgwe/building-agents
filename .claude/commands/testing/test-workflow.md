# Test Workflow Automation

I need you to create automated tests for a workflow or user journey to ensure reliability.

## Context

**Workflow to Test**: $ARGUMENTS

(Examples: "User signup and onboarding flow", "Checkout and payment process", "Data import and processing pipeline", "API endpoint integration", "CI/CD deployment pipeline")

## Your Task

Route this to the **workflow-optimizer** agent who will coordinate with qa-engineer and test-automator:

1. **Define Test Scope**:
   **Workflow Type**:
   - **User Journey**: End-to-end user flows (signup, checkout, etc.)
   - **API Workflow**: Multi-step API interactions
   - **Data Pipeline**: ETL/data processing workflows
   - **Integration**: Third-party service integrations
   - **CI/CD**: Build, test, deploy automation

   **Test Levels**:
   - **Unit Tests**: Individual functions and components (70% of tests)
   - **Integration Tests**: Interactions between modules (20% of tests)
   - **E2E Tests**: Complete user journeys (10% of tests)
   - **Contract Tests**: API contracts between services

2. **Map Workflow Steps**:
   **User Journey Example** (Checkout flow):
   ```
   1. User adds item to cart
   2. User proceeds to checkout
   3. User enters shipping address
   4. User enters payment details
   5. User confirms order
   6. Payment processes successfully
   7. Order confirmation email sent
   8. Order appears in order history
   ```

   **Identify Critical Paths**:
   - Happy path (everything works)
   - Error paths (validation errors, payment failures)
   - Edge cases (empty cart, expired session)
   - Boundary conditions (max quantity, minimum order)

3. **Test Strategy by Level**:

   ### **Unit Tests** (Fast, Isolated, 70% of suite):
   **What to Test**:
   - Pure functions (input → output, no side effects)
   - Business logic (calculations, validations, transformations)
   - Edge cases (empty input, null values, max values)

   **Tools**: Jest, Vitest, pytest, JUnit

   **Example** (JavaScript):
   ```javascript
   describe('calculateTotal', () => {
     it('should calculate total with tax', () => {
       const items = [{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }]
       const total = calculateTotal(items, { taxRate: 0.1 })
       expect(total).toBe(27.5) // (10*2 + 5*1) * 1.1
     })

     it('should handle empty cart', () => {
       expect(calculateTotal([], { taxRate: 0.1 })).toBe(0)
     })

     it('should throw on negative prices', () => {
       const items = [{ price: -10, quantity: 1 }]
       expect(() => calculateTotal(items)).toThrow('Invalid price')
     })
   })
   ```

   ### **Integration Tests** (Moderate Speed, 20% of suite):
   **What to Test**:
   - API endpoints (request → response)
   - Database interactions (CRUD operations)
   - Service integrations (third-party APIs)
   - Message queues and events

   **Tools**: Supertest, pytest, RestAssured, MSW (mocking)

   **Example** (Node.js + Express):
   ```javascript
   describe('POST /api/orders', () => {
     it('should create order with valid data', async () => {
       const order = {
         items: [{ productId: '123', quantity: 2 }],
         userId: 'user-456'
       }
       const response = await request(app)
         .post('/api/orders')
         .send(order)
         .expect(201)

       expect(response.body.id).toBeDefined()
       expect(response.body.status).toBe('pending')
     })

     it('should return 400 for empty cart', async () => {
       const order = { items: [], userId: 'user-456' }
       await request(app)
         .post('/api/orders')
         .send(order)
         .expect(400)
     })
   })
   ```

   ### **End-to-End Tests** (Slow, 10% of suite):
   **What to Test**:
   - Critical user journeys (signup, checkout, key features)
   - Cross-browser compatibility
   - Mobile responsiveness
   - Real integrations (staging environment)

   **Tools**: Playwright, Cypress, Selenium, Puppeteer

   **Example** (Playwright):
   ```javascript
   test('complete checkout flow', async ({ page }) => {
     // 1. Navigate to product page
     await page.goto('/products/123')
     await page.click('button:has-text("Add to Cart")')

     // 2. Proceed to checkout
     await page.click('a:has-text("Cart")')
     await page.click('button:has-text("Checkout")')

     // 3. Fill shipping info
     await page.fill('#address', '123 Main St')
     await page.fill('#city', 'New York')
     await page.fill('#zip', '10001')
     await page.click('button:has-text("Continue")')

     // 4. Fill payment info (use test card)
     await page.fill('#card-number', '4242424242424242')
     await page.fill('#expiry', '12/25')
     await page.fill('#cvc', '123')

     // 5. Submit order
     await page.click('button:has-text("Place Order")')

     // 6. Assert order confirmation
     await expect(page.locator('h1')).toHaveText('Order Confirmed')
     await expect(page.locator('.order-id')).toBeVisible()
   })
   ```

4. **Test Data Management**:
   **Test Data Strategy**:
   - **Fixtures**: Static test data (JSON files, SQL seeds)
   - **Factories**: Programmatically generate test data
   - **Mocks**: Fake third-party services
   - **Sandboxes**: Use test accounts (Stripe test mode, Twilio test numbers)

   **Example** (Test factory):
   ```javascript
   const createTestUser = (overrides = {}) => ({
     id: 'test-user-' + Math.random(),
     email: 'test@example.com',
     name: 'Test User',
     role: 'user',
     ...overrides
   })

   const createTestOrder = (overrides = {}) => ({
     id: 'order-' + Math.random(),
     items: [{ productId: '123', quantity: 1 }],
     total: 100,
     status: 'pending',
     ...overrides
   })
   ```

   **Cleanup Strategy**:
   - Delete test data after each test (isolation)
   - Use database transactions (rollback after test)
   - Separate test database from development

5. **Error Handling Tests**:
   **Test Failure Scenarios**:
   - Validation errors (invalid email, missing required fields)
   - Network errors (timeout, connection refused)
   - Third-party failures (payment gateway down, Stripe error)
   - Race conditions (concurrent requests, deadlocks)
   - Resource limits (file too large, rate limit exceeded)

   **Example** (Error handling):
   ```javascript
   it('should handle payment gateway timeout', async () => {
     // Mock Stripe to timeout
     mockStripe.paymentIntents.create.mockRejectedValue(
       new Error('Request timeout')
     )

     const response = await request(app)
       .post('/api/checkout')
       .send({ cart: [{ id: '123' }], paymentMethod: 'card' })
       .expect(503) // Service Unavailable

     expect(response.body.error).toContain('Payment service unavailable')
     expect(response.body.retry).toBe(true)
   })
   ```

6. **CI/CD Integration**:
   **Test Automation Pipeline**:
   ```yaml
   # .github/workflows/test.yml
   name: Test Suite
   on: [push, pull_request]

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Install dependencies
           run: npm ci

         - name: Run unit tests
           run: npm run test:unit

         - name: Run integration tests
           run: npm run test:integration
           env:
             DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

         - name: Run E2E tests
           run: npm run test:e2e
           env:
             BASE_URL: http://localhost:3000

         - name: Upload coverage
           uses: codecov/codecov-action@v3
           with:
             files: ./coverage/coverage-final.json
   ```

   **Test Quality Gates** (block merge if fail):
   - All tests passing (100%)
   - Code coverage > 80%
   - No security vulnerabilities (npm audit, Snyk)
   - Linting passing (ESLint, Prettier)

7. **Performance Testing** (for workflows):
   **Load Testing**:
   - Simulate multiple concurrent users
   - Measure response times (p50, p95, p99)
   - Identify bottlenecks (slow queries, N+1 problems)

   **Tools**: k6, Artillery, JMeter, Locust

   **Example** (k6 load test):
   ```javascript
   import http from 'k6/http'
   import { check } from 'k6'

   export const options = {
     stages: [
       { duration: '2m', target: 100 }, // Ramp up to 100 users
       { duration: '5m', target: 100 }, // Stay at 100 users
       { duration: '2m', target: 0 },   // Ramp down to 0 users
     ],
     thresholds: {
       'http_req_duration': ['p(95)<500'], // 95% of requests < 500ms
       'http_req_failed': ['rate<0.01'],   // Error rate < 1%
     },
   }

   export default function () {
     const res = http.post('https://api.example.com/checkout', {
       items: [{ id: '123', quantity: 1 }],
     })
     check(res, {
       'status is 200': (r) => r.status === 200,
       'response time < 500ms': (r) => r.timings.duration < 500,
     })
   }
   ```

8. **Test Maintenance & Reliability**:
   **Reduce Flakiness**:
   - Use explicit waits (not sleep)
   - Avoid hardcoded timeouts (use retry logic)
   - Clean up state between tests (database resets)
   - Mock time-dependent tests (freeze time with libraries)

   **Example** (Playwright explicit wait):
   ```javascript
   // ❌ Flaky - fixed timeout
   await page.waitForTimeout(5000)

   // ✅ Reliable - wait for specific condition
   await page.waitForSelector('.order-confirmation', { timeout: 10000 })
   await expect(page.locator('.order-id')).toBeVisible()
   ```

   **Test Retry Strategy**:
   - Retry flaky tests (max 3 times)
   - Log failures for investigation
   - Quarantine consistently failing tests
   - Review and fix flaky tests weekly

9. **Test Coverage & Reporting**:
   **Coverage Metrics**:
   - **Line coverage**: % of code lines executed (target: > 80%)
   - **Branch coverage**: % of branches (if/else) tested
   - **Function coverage**: % of functions called
   - **Statement coverage**: % of statements executed

   **Coverage Tools**: Istanbul/nyc, Jest --coverage, pytest-cov

   **Example** (Jest coverage report):
   ```bash
   npm run test -- --coverage

   ----------|---------|----------|---------|---------|-------------------
   File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
   ----------|---------|----------|---------|---------|-------------------
   All files |   85.5  |   78.2   |   90.1  |   85.5  |
   cart.js   |   95.2  |   88.9   |  100.0  |   95.2  | 23-25
   checkout.js|  72.5  |   65.0   |   80.0  |   72.5  | 45-60, 88-92
   ----------|---------|----------|---------|---------|-------------------
   ```

   **Test Report Dashboard**:
   - Test pass/fail trends over time
   - Flaky test identification (tests that intermittently fail)
   - Code coverage trends
   - Test execution time (identify slow tests)

10. **Continuous Improvement**:
    **Test Metrics to Track**:
    - Test execution time (keep suite fast, target: < 10 minutes)
    - Flakiness rate (% of tests that fail intermittently, target: < 1%)
    - Coverage (target: > 80%)
    - Test count (growing with codebase)

    **Regular Reviews**:
    - Weekly: Review flaky tests, fix or quarantine
    - Monthly: Review coverage gaps, add tests for uncovered code
    - Quarterly: Refactor slow tests, optimize test suite
    - Annually: Major test infrastructure upgrades

## Deliverables

- Test plan (scope, strategy, coverage targets)
- Test suite (unit, integration, E2E tests)
- CI/CD pipeline integration (automated test runs)
- Test coverage report (current coverage, gaps)
- Test documentation (how to run tests, add new tests)
- Flaky test report (tests to fix or investigate)

## Test Suite Structure

```
tests/
├── unit/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── components/
├── integration/
│   ├── api/
│   ├── database/
│   └── services/
├── e2e/
│   ├── user-flows/
│   │   ├── signup.spec.ts
│   │   ├── checkout.spec.ts
│   │   └── onboarding.spec.ts
│   └── critical-paths/
├── fixtures/
│   ├── users.json
│   ├── products.json
│   └── orders.json
└── helpers/
    ├── factories.ts
    ├── mocks.ts
    └── setup.ts
```

## Success Criteria

- **High coverage**: > 80% code coverage across unit + integration tests
- **Fast feedback**: Test suite completes in < 10 minutes
- **Reliable**: < 1% flaky test rate
- **Automated**: All tests run on every PR, blocking merge if fail
- **Maintainable**: Clear test structure, easy to add new tests

## Testing Tools Reference

**Unit Testing**: Jest, Vitest, pytest, JUnit, RSpec
**Integration Testing**: Supertest, pytest, RestAssured, MSW
**E2E Testing**: Playwright, Cypress, Selenium, Puppeteer
**Load Testing**: k6, Artillery, JMeter, Locust
**Coverage**: Istanbul/nyc, Jest, pytest-cov, JaCoCo
**CI/CD**: GitHub Actions, GitLab CI, CircleCI, Jenkins

**Route to**: System Coordinator → Testing Coordinator → workflow-optimizer (coordinates qa-engineer, test-automator)
