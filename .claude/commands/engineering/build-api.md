# Build API

I need you to design and implement a REST or GraphQL API endpoint.

## Context

**API Specification**: $ARGUMENTS

## Your Task

Route this to the **backend-architect** agent who will:

1. **Design API Contract**:
   - Define endpoints (REST) or schema (GraphQL)
   - Specify request/response formats
   - Design error handling
   - Plan authentication/authorization

2. **Implement Backend**:
   - Create API routes and handlers
   - Add input validation (Zod schemas)
   - Implement business logic
   - Add database queries (if needed)
   - Handle errors gracefully

3. **Security & Performance**:
   - Add rate limiting
   - Validate inputs against injection attacks
   - Optimize database queries
   - Add caching if appropriate

4. **Testing**:
   - Unit tests for business logic
   - Integration tests for API endpoints
   - Test error cases and edge cases

5. **Documentation**:
   - OpenAPI/Swagger spec
   - Example requests/responses
   - Authentication requirements

## Quality Standards

- Input validation on all endpoints
- Proper HTTP status codes
- Error messages clear and actionable
- Response time < 200ms p95
- Test coverage > 80%

**Route to**: System Coordinator → Engineering Coordinator → backend-architect
