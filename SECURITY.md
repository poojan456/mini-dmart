# Security Overview & Findings

This document outlines the security mechanisms, Role-Based Access Control (RBAC), and known limitations of the Mini D-Mart application.

## 1. Authentication & Authorization (RBAC)
- **JSON Web Tokens (JWT)**: The application is entirely stateless. Upon login, a JWT is issued with a 24-hour expiration.
- **Protected Endpoints**: The Spring Security configuration actively intercepts HTTP requests:
  - `GET /api/products` is public for browsing.
  - `POST`, `PUT`, `DELETE /api/products` are secured with `@PreAuthorize("hasRole('ADMIN')")`.
  - `GET /api/returns` and `PUT /api/returns/{id}/status` are restricted to Admins.
  - User-specific data (e.g., `/api/orders/my-orders`) relies on `SecurityContextHolder` to securely extract the identity of the requester from the JWT, ensuring users cannot view other people's orders via URL tampering.

## 2. Input Validation
- **Frontend Validation**: The React application enforces strict regex-based filtering (e.g., stripping non-alpha characters on names) and strong password policies (requires Uppercase, Lowercase, Number, and Special character).
- **Backend Validation**: The Spring Boot entities utilize `jakarta.validation.constraints` (`@NotBlank`, `@NotNull`, `@Min(0)`) to ensure database integrity even if the frontend validation is bypassed.

## 3. Secure Password Handling
- Passwords are never stored in plain text.
- Spring Security's `BCryptPasswordEncoder` is utilized to hash passwords during registration and verify hashes during login.

## 4. Environment Variables & Secrets
- Secrets like the database password (`DB_PASSWORD`) and the JWT signature key (`JWT_SECRET`) are externalized in `application.properties` using standard Spring environment variable injection. See `.env.example` for the setup.

## 5. Security Findings & Known Limitations
- **Token Invalidation**: Because the application uses stateless JWTs, there is no server-side session tracking. This means there is no "logout" route on the backend; the frontend merely deletes the token from LocalStorage. A stolen token remains valid until it expires.
- **SQL Injection**: Prevented by utilizing Spring Data JPA and Hibernate, which automatically parameterize queries.
- **XSS (Cross-Site Scripting)**: React safely escapes DOM text insertions by default, preventing injection via input fields like product names or descriptions.

