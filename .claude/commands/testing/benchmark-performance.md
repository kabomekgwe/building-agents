# Benchmark System Performance

I need you to measure, analyze, and optimize system performance under various load conditions.

## Context

**Performance Goal**: $ARGUMENTS

(Examples: "Measure API response times under load", "Optimize database queries", "Improve page load times", "Benchmark serverless function cold starts", "Load test checkout flow for Black Friday")

## Your Task

Route this to the **performance-benchmarker** agent who will:

1. **Define Performance Targets**:
   **Web Performance (Frontend)**:
   - First Contentful Paint (FCP): < 1.8s
   - Largest Contentful Paint (LCP): < 2.5s
   - First Input Delay (FID): < 100ms
   - Cumulative Layout Shift (CLS): < 0.1
   - Time to Interactive (TTI): < 3.8s
   - Total Blocking Time (TBT): < 300ms

   **API Performance (Backend)**:
   - p50 (median): < 100ms
   - p95: < 200ms
   - p99: < 500ms
   - p99.9: < 1000ms
   - Error rate: < 0.1%
   - Throughput: [target requests/second]

   **Database Performance**:
   - Query execution time: < 50ms
   - Connection pool utilization: < 80%
   - Database CPU: < 70%
   - Index hit rate: > 99%

2. **Performance Measurement Tools**:
   **Frontend Performance**:
   - **Lighthouse**: Google's web performance auditing tool
   - **WebPageTest**: Real-world performance testing
   - **Chrome DevTools**: Network, Performance, Coverage tabs
   - **Core Web Vitals**: Real user monitoring (RUM)

   **Backend Performance**:
   - **k6**: Load testing for APIs
   - **Artillery**: Load testing with scenarios
   - **Apache JMeter**: Enterprise load testing
   - **Locust**: Python-based load testing

   **Database Performance**:
   - **EXPLAIN ANALYZE**: Query execution plans (PostgreSQL, MySQL)
   - **pg_stat_statements**: PostgreSQL query stats
   - **MySQL slow query log**: Identify slow queries
   - **Database profiling**: MongoDB, Redis profiling

   **Application Performance Monitoring (APM)**:
   - **Datadog**: Full-stack observability
   - **New Relic**: Application monitoring
   - **Sentry**: Error tracking and performance
   - **OpenTelemetry**: Vendor-neutral observability

3. **Frontend Performance Benchmarking**:
   **Run Lighthouse Audit**:
   ```bash
   # Install Lighthouse CLI
   npm install -g lighthouse

   # Run audit
   lighthouse https://example.com --view --output=html,json

   # Key metrics from report:
   # - Performance score (0-100, target: > 90)
   # - FCP, LCP, TTI, TBT, CLS
   # - Opportunities (suggestions for improvement)
   # - Diagnostics (issues detected)
   ```

   **Analyze Results**:
   - Performance score: [current] / 100 (target: > 90)
   - LCP: [current] (target: < 2.5s)
   - Opportunities with biggest impact:
     - Eliminate render-blocking resources
     - Properly size images
     - Defer offscreen images
     - Minify CSS/JavaScript
     - Use HTTP/2 or HTTP/3
     - Reduce third-party code

   **Optimization Strategies**:
   - **Code Splitting**: Load only necessary JavaScript
   - **Lazy Loading**: Defer images and components
   - **Compression**: Gzip or Brotli for text assets
   - **Caching**: Leverage browser cache (Cache-Control headers)
   - **CDN**: Serve static assets from edge locations
   - **Image Optimization**: WebP format, responsive images

   **Example** (Next.js optimization):
   ```javascript
   // Code splitting with dynamic imports
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>,
   })

   // Image optimization
   import Image from 'next/image'
   <Image
     src="/hero.jpg"
     width={800}
     height={600}
     alt="Hero"
     loading="lazy"
   />

   // Font optimization
   import { Inter } from 'next/font/google'
   const inter = Inter({ subsets: ['latin'], display: 'swap' })
   ```

4. **API Load Testing (k6)**:
   **Basic Load Test Script**:
   ```javascript
   import http from 'k6/http'
   import { check, sleep } from 'k6'

   export const options = {
     stages: [
       { duration: '2m', target: 100 },  // Ramp up to 100 VUs
       { duration: '5m', target: 100 },  // Stay at 100 VUs
       { duration: '2m', target: 200 },  // Spike to 200 VUs
       { duration: '5m', target: 200 },  // Stay at 200 VUs
       { duration: '2m', target: 0 },    // Ramp down to 0
     ],
     thresholds: {
       'http_req_duration': ['p(95)<200', 'p(99)<500'], // 95% < 200ms, 99% < 500ms
       'http_req_failed': ['rate<0.01'],                // Error rate < 1%
     },
   }

   export default function () {
     // GET request
     const res1 = http.get('https://api.example.com/users')
     check(res1, {
       'status is 200': (r) => r.status === 200,
       'response time < 200ms': (r) => r.timings.duration < 200,
     })

     sleep(1) // Think time (simulate user delay)

     // POST request
     const res2 = http.post('https://api.example.com/orders', JSON.stringify({
       items: [{ id: '123', quantity: 1 }],
     }), {
       headers: { 'Content-Type': 'application/json' },
     })
     check(res2, {
       'order created': (r) => r.status === 201,
     })

     sleep(1)
   }
   ```

   **Run Load Test**:
   ```bash
   k6 run loadtest.js

   # Output:
   # http_req_duration..............: avg=150ms  p(95)=180ms  p(99)=450ms
   # http_req_failed................: 0.05%
   # http_reqs......................: 12000 (200/s)
   # vus............................: 100
   # vus_max........................: 200
   ```

   **Analyze Results**:
   - Throughput: [requests/second achieved]
   - Response times: p50, p95, p99 (compare to targets)
   - Error rate: [%] (target: < 1%)
   - Bottlenecks identified: Database queries, third-party API calls, CPU-intensive operations

5. **Database Query Optimization**:
   **Identify Slow Queries** (PostgreSQL):
   ```sql
   -- Install pg_stat_statements extension
   CREATE EXTENSION pg_stat_statements;

   -- Find slowest queries
   SELECT
     query,
     calls,
     total_exec_time / 1000 AS total_time_seconds,
     mean_exec_time / 1000 AS avg_time_ms,
     max_exec_time / 1000 AS max_time_ms
   FROM pg_stat_statements
   WHERE query NOT LIKE '%pg_stat_statements%'
   ORDER BY total_exec_time DESC
   LIMIT 10;
   ```

   **Analyze Query Plans** (EXPLAIN ANALYZE):
   ```sql
   -- Analyze specific slow query
   EXPLAIN ANALYZE
   SELECT u.id, u.name, COUNT(o.id) AS order_count
   FROM users u
   LEFT JOIN orders o ON u.id = o.user_id
   WHERE u.created_at > '2024-01-01'
   GROUP BY u.id
   ORDER BY order_count DESC
   LIMIT 100;

   -- Look for:
   -- - Seq Scan (table scans): Add index
   -- - High "actual time": Optimize query or add index
   -- - Nested Loop with high rows: Consider JOIN optimization
   ```

   **Optimization Strategies**:
   - **Add Indexes**: Create indexes on frequently queried columns
   - **Optimize Joins**: Ensure foreign keys are indexed
   - **Limit Result Sets**: Use LIMIT, pagination
   - **Avoid N+1 Queries**: Use eager loading (JOIN, subquery)
   - **Denormalize**: Add redundant columns to avoid JOINs (for read-heavy tables)
   - **Cache**: Cache query results (Redis, application cache)

   **Example** (Index creation):
   ```sql
   -- Create index on frequently queried column
   CREATE INDEX idx_users_created_at ON users(created_at);

   -- Composite index for multiple columns
   CREATE INDEX idx_orders_user_status ON orders(user_id, status);

   -- Partial index (only for specific condition)
   CREATE INDEX idx_orders_pending ON orders(user_id) WHERE status = 'pending';
   ```

6. **N+1 Query Detection & Fix**:
   **Detect N+1 Problem**:
   ```javascript
   // ❌ N+1 query problem
   const users = await db.query('SELECT * FROM users LIMIT 10') // 1 query
   for (const user of users) {
     const orders = await db.query(
       'SELECT * FROM orders WHERE user_id = ?', [user.id]
     ) // 10 queries (one per user)
     user.orders = orders
   }
   // Total: 11 queries (1 + 10)
   ```

   **Fix with JOIN or Eager Loading**:
   ```javascript
   // ✅ Fixed with JOIN
   const usersWithOrders = await db.query(`
     SELECT
       u.id, u.name,
       json_agg(o.*) AS orders
     FROM users u
     LEFT JOIN orders o ON u.id = o.user_id
     GROUP BY u.id
     LIMIT 10
   `) // 1 query
   // Total: 1 query
   ```

   **ORM Example** (Prisma):
   ```javascript
   // ✅ Use include to eager load relations
   const users = await prisma.user.findMany({
     take: 10,
     include: {
       orders: true, // Eager load orders (1 query instead of N+1)
     },
   })
   ```

7. **Caching Strategy**:
   **Multi-Tier Caching**:
   - **L1 (Application Cache)**: In-memory cache (Node.js LRU cache)
   - **L2 (Distributed Cache)**: Redis, Memcached
   - **L3 (CDN Cache)**: CloudFlare, AWS CloudFront
   - **L4 (Browser Cache)**: Cache-Control headers

   **Example** (Redis caching):
   ```javascript
   async function getUser(userId) {
     // Check cache first (L2)
     const cached = await redis.get(`user:${userId}`)
     if (cached) return JSON.parse(cached)

     // Cache miss, query database
     const user = await db.query('SELECT * FROM users WHERE id = ?', [userId])

     // Store in cache (expire after 1 hour)
     await redis.setex(`user:${userId}`, 3600, JSON.stringify(user))

     return user
   }
   ```

   **Cache Invalidation**:
   - **TTL (Time to Live)**: Expire after X seconds
   - **Event-based**: Invalidate when data changes (update, delete)
   - **Versioning**: Append version to cache key
   - **Cache-aside pattern**: Application manages cache

8. **Serverless Cold Start Optimization**:
   **Measure Cold Starts**:
   - Track function initialization time
   - Monitor p95, p99 cold start latency
   - Identify cold start frequency

   **Optimization Strategies**:
   - **Reduce package size**: Remove unused dependencies, use tree-shaking
   - **Provisioned concurrency**: Keep functions warm (AWS Lambda)
   - **Connection pooling**: Reuse database connections
   - **Lazy initialization**: Defer heavy initialization until needed

   **Example** (AWS Lambda optimization):
   ```javascript
   // ❌ Creates new DB connection on every invocation
   exports.handler = async (event) => {
     const db = await createConnection() // Slow on cold start
     const result = await db.query('SELECT * FROM users')
     return result
   }

   // ✅ Reuse connection across invocations
   let dbConnection
   exports.handler = async (event) => {
     if (!dbConnection) {
       dbConnection = await createConnection() // Only on cold start
     }
     const result = await dbConnection.query('SELECT * FROM users')
     return result
   }
   ```

9. **Performance Monitoring Dashboard**:
   **Key Metrics to Track**:
   - **Response Time**: p50, p95, p99 (by endpoint)
   - **Throughput**: Requests per second
   - **Error Rate**: % of failed requests
   - **Availability**: Uptime % (target: 99.9%)
   - **Database**: Query time, connection pool usage
   - **Infrastructure**: CPU, memory, disk usage

   **Alerting**:
   - p95 response time > 200ms (warning)
   - p99 response time > 500ms (critical)
   - Error rate > 1% (critical)
   - Availability < 99.9% (critical)

   **Tools**: Datadog, Grafana, New Relic, Sentry

10. **Performance Regression Testing**:
    **Continuous Performance Monitoring**:
    - Run load tests on every deploy (CI/CD integration)
    - Compare performance to baseline (previous version)
    - Block deployment if regression detected (p95 > baseline + 20%)

    **Example** (GitHub Actions):
    ```yaml
    name: Performance Test
    on: [pull_request]

    jobs:
      performance:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - name: Run k6 load test
            run: |
              docker run --rm -v $PWD:/k6 grafana/k6 run /k6/loadtest.js

          - name: Compare to baseline
            run: |
              # Compare p95 to baseline
              # Fail if > 20% regression
              python scripts/compare-performance.py
    ```

## Deliverables

- Performance baseline report (current metrics)
- Load test results (k6 output, response times, throughput)
- Bottleneck analysis (slow queries, N+1 problems, heavy computations)
- Optimization recommendations (prioritized by impact)
- Optimized code/queries (with before/after benchmarks)
- Performance monitoring dashboard (ongoing tracking)

## Performance Optimization Checklist

**Frontend**:
- [ ] Code splitting and lazy loading
- [ ] Image optimization (WebP, responsive, lazy loading)
- [ ] Minify and compress assets (Gzip, Brotli)
- [ ] Leverage browser caching (Cache-Control headers)
- [ ] Use CDN for static assets
- [ ] Reduce third-party scripts

**Backend**:
- [ ] Database query optimization (indexes, EXPLAIN ANALYZE)
- [ ] Fix N+1 queries (eager loading, JOIN)
- [ ] Implement caching (Redis, application cache)
- [ ] Connection pooling (database, API clients)
- [ ] Async operations (non-blocking I/O)
- [ ] Rate limiting and throttling

**Database**:
- [ ] Add indexes on queried columns
- [ ] Optimize slow queries (EXPLAIN ANALYZE)
- [ ] Use read replicas (scale reads)
- [ ] Denormalize for read-heavy tables
- [ ] Archive old data (partitioning, archival)

**Infrastructure**:
- [ ] Horizontal scaling (add more servers)
- [ ] Vertical scaling (upgrade server resources)
- [ ] Load balancing (distribute traffic)
- [ ] Auto-scaling (scale based on demand)
- [ ] Use managed services (reduce operational overhead)

## Success Criteria

- **Fast response times**: p95 < 200ms for APIs
- **High throughput**: Handle [target RPS] requests/second
- **Low error rate**: < 0.1% errors under load
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **No regressions**: Performance maintained or improved with each release

**Route to**: System Coordinator → Testing Coordinator → performance-benchmarker
