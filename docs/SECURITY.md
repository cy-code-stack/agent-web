# Security Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Authorization](#3-authorization)
4. [API Security](#4-api-security)
5. [Data Protection](#5-data-protection)
6. [Implementation Guidelines](#6-implementation-guidelines)

---

## 1. Overview

### Security Principles

| Principle | Implementation |
|-----------|----------------|
| **Defense in Depth** | Multiple security layers (network, application, data) |
| **Least Privilege** | Users get minimum required permissions |
| **Secure by Default** | All endpoints require authentication unless explicitly public |
| **Fail Securely** | Errors don't expose sensitive information |

### Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SECURITY LAYERS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Layer 1: Network Security                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  - TLS 1.3 encryption                                                │    │
│  │  - WAF (Web Application Firewall)                                    │    │
│  │  - DDoS protection (CloudFlare/AWS Shield)                          │    │
│  │  - IP allowlisting for admin endpoints                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Layer 2: Application Security                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  - JWT authentication                                                │    │
│  │  - RBAC authorization                                                │    │
│  │  - Rate limiting                                                     │    │
│  │  - Input validation                                                  │    │
│  │  - CORS configuration                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Layer 3: Data Security                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  - Password hashing (bcrypt)                                         │    │
│  │  - Parameterized queries (SQL injection prevention)                 │    │
│  │  - Sensitive data encryption at rest                                │    │
│  │  - Audit logging                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication

### 2.1 JWT Token Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         JWT AUTHENTICATION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. LOGIN                                                                    │
│  ┌──────────┐                      ┌──────────────┐                         │
│  │  Client  │  POST /auth/login    │   API Server │                         │
│  │          │ ────────────────────►│              │                         │
│  │          │  {email, password}   │              │                         │
│  │          │                      │  ┌────────┐  │                         │
│  │          │                      │  │Validate│  │                         │
│  │          │                      │  │Password│  │                         │
│  │          │                      │  └────┬───┘  │                         │
│  │          │                      │       │      │                         │
│  │          │                      │  ┌────▼───┐  │                         │
│  │          │                      │  │Generate│  │                         │
│  │          │                      │  │ Tokens │  │                         │
│  │          │ ◄────────────────────│  └────────┘  │                         │
│  │          │  {access, refresh}   │              │                         │
│  └──────────┘                      └──────────────┘                         │
│                                                                              │
│  2. AUTHENTICATED REQUEST                                                    │
│  ┌──────────┐                      ┌──────────────┐                         │
│  │  Client  │  GET /agents/me      │   API Server │                         │
│  │          │ ────────────────────►│              │                         │
│  │          │  Authorization:      │  ┌────────┐  │                         │
│  │          │  Bearer <token>      │  │Validate│  │                         │
│  │          │                      │  │  JWT   │  │                         │
│  │          │                      │  └────┬───┘  │                         │
│  │          │                      │       │      │                         │
│  │          │                      │  ┌────▼───┐  │                         │
│  │          │                      │  │ Check  │  │                         │
│  │          │                      │  │Blacklst│  │                         │
│  │          │                      │  └────┬───┘  │                         │
│  │          │                      │       │      │                         │
│  │          │ ◄────────────────────│  ┌────▼───┐  │                         │
│  │          │  {agent data}        │  │Process │  │                         │
│  └──────────┘                      │  │Request │  │                         │
│                                    └──────────────┘                         │
│                                                                              │
│  3. TOKEN REFRESH                                                            │
│  ┌──────────┐                      ┌──────────────┐                         │
│  │  Client  │  POST /auth/refresh  │   API Server │                         │
│  │          │ ────────────────────►│              │                         │
│  │          │  {refresh_token}     │  ┌────────┐  │                         │
│  │          │                      │  │Validate│  │                         │
│  │          │                      │  │Refresh │  │                         │
│  │          │                      │  └────┬───┘  │                         │
│  │          │                      │       │      │                         │
│  │          │ ◄────────────────────│  ┌────▼───┐  │                         │
│  │          │  {new access,        │  │Generate│  │                         │
│  │          │   new refresh}       │  │New Pair│  │                         │
│  └──────────┘                      └──────────────┘                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Token Configuration

| Token Type | Lifetime | Storage | Algorithm |
|------------|----------|---------|-----------|
| Access Token | 15 minutes | Memory / HttpOnly Cookie | RS256 |
| Refresh Token | 7 days | HttpOnly Cookie + Redis | Opaque |

### 2.3 Access Token Structure (JWT)

```
Header:
{
  "alg": "RS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "123",                    // User ID
  "agent_id": 456,                 // Agent ID
  "roles": ["agent", "team_leader"],
  "realty_id": 1,                  // Realty ID (nullable)
  "permissions": ["client:read", "client:write"],
  "iat": 1710000000,               // Issued at
  "exp": 1710000900,               // Expires (15 min)
  "jti": "uuid-token-id"           // For blacklisting
}

Signature:
RS256(base64(header) + "." + base64(payload), private_key)
```

### 2.4 Token Security Measures

| Measure | Implementation |
|---------|----------------|
| **Signing Algorithm** | RS256 (asymmetric) - public key for verification |
| **Token Blacklist** | Redis set for revoked token IDs (jti) |
| **Refresh Token Rotation** | New refresh token on each refresh |
| **Device Binding** | Refresh token bound to device fingerprint |
| **Secure Transmission** | HTTPS only, no tokens in URL |

### 2.5 Password Security

```go
// Password requirements
const (
    MinPasswordLength = 8
    MaxPasswordLength = 72  // bcrypt limit
)

// Validation rules
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

// Hashing
- Algorithm: bcrypt
- Cost factor: 12 (adjustable based on hardware)
- Salt: Automatically generated by bcrypt
```

---

## 3. Authorization

### 3.1 Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ROLE HIERARCHY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              ┌──────────┐                                   │
│                              │  Broker  │                                   │
│                              │  (Admin) │                                   │
│                              └────┬─────┘                                   │
│                                   │                                         │
│                    ┌──────────────┼──────────────┐                         │
│                    │              │              │                         │
│              ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐                    │
│              │   Unit    │ │   Team    │ │  Senior   │                    │
│              │  Manager  │ │  Leader   │ │   Agent   │                    │
│              └─────┬─────┘ └─────┬─────┘ └─────┬─────┘                    │
│                    │             │             │                          │
│                    └─────────────┼─────────────┘                          │
│                                  │                                         │
│                            ┌─────▼─────┐                                   │
│                            │   Agent   │                                   │
│                            │  (Base)   │                                   │
│                            └───────────┘                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Role Definitions

| Role | Description | Scope |
|------|-------------|-------|
| **Agent** | Base sales agent | Own data only |
| **Senior Agent** | Experienced agent | Own data + limited reports |
| **Team Leader** | Leads a team | Team data access |
| **Unit Manager** | Manages a unit | Unit data access |
| **Broker** | Licensed broker | Full realty access |

### 3.3 Permission Matrix

| Permission | Agent | Team Leader | Unit Manager | Broker |
|------------|-------|-------------|--------------|--------|
| `profile:read` | Own | Own | Own | Own |
| `profile:write` | Own | Own | Own | Own |
| `client:read` | Own | Team | Unit | All |
| `client:write` | Own | Team | Unit | All |
| `client:delete` | - | - | Unit | All |
| `sales:read` | Own | Team | Unit | All |
| `sales:write` | Own | Team | Unit | All |
| `incentive:read` | Own | Team | Unit | All |
| `incentive:approve` | - | - | Unit | All |
| `appointment:read` | Own | Team | Unit | All |
| `appointment:write` | Own | Team | Unit | All |
| `team:read` | - | Team | Unit | All |
| `team:manage` | - | - | Unit | All |
| `reports:view` | - | Team | Unit | All |
| `reports:export` | - | - | Unit | All |

### 3.4 Resource-Based Authorization

Beyond RBAC, enforce ownership and hierarchy rules:

```go
// Authorization policy example
func CanAccessClient(user *User, client *Client) bool {
    // 1. Check if user owns the client
    if isClientOwner(user.AgentID, client.ID) {
        return true
    }

    // 2. Check if user is a manager with hierarchy access
    if hasManagerRole(user) {
        downlineAgents := getDownlineAgents(user.AgentID)
        for _, agentID := range downlineAgents {
            if isClientOwner(agentID, client.ID) {
                return true
            }
        }
    }

    // 3. Check if user is a broker in the same realty
    if isBroker(user) && client.RealtyID == user.RealtyID {
        return true
    }

    return false
}
```

### 3.5 Authorization Middleware

```go
// internal/infrastructure/middleware/authorization.go

func RequirePermission(permission string) gin.HandlerFunc {
    return func(c *gin.Context) {
        claims := getClaims(c)

        if !hasPermission(claims.Permissions, permission) {
            c.AbortWithStatusJSON(403, gin.H{
                "error": map[string]interface{}{
                    "code":    "FORBIDDEN",
                    "message": "You don't have permission to perform this action",
                },
            })
            return
        }

        c.Next()
    }
}

func RequireOwnership(resourceType string) gin.HandlerFunc {
    return func(c *gin.Context) {
        claims := getClaims(c)
        resourceID := c.Param("id")

        if !canAccessResource(claims, resourceType, resourceID) {
            c.AbortWithStatusJSON(403, gin.H{
                "error": map[string]interface{}{
                    "code":    "FORBIDDEN",
                    "message": "You don't have access to this resource",
                },
            })
            return
        }

        c.Next()
    }
}
```

---

## 4. API Security

### 4.1 Rate Limiting

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RATE LIMITING STRATEGY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tier 1: IP-Based Rate Limiting                                              │
│  ├── General endpoints: 100 requests/minute                                 │
│  ├── Login endpoint: 5 requests/minute                                      │
│  └── Password reset: 3 requests/hour                                        │
│                                                                              │
│  Tier 2: User-Based Rate Limiting                                            │
│  ├── Authenticated requests: 1000 requests/minute                           │
│  ├── Export endpoints: 10 requests/hour                                     │
│  └── File upload: 20 requests/hour                                          │
│                                                                              │
│  Implementation: Sliding Window (Redis)                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Key: ratelimit:{ip}:{endpoint} or ratelimit:{user_id}:{endpoint}   │    │
│  │  Value: Request count                                                │    │
│  │  TTL: Window duration                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Rate Limiting Implementation

```go
// internal/infrastructure/middleware/rate_limiter.go

type RateLimiter struct {
    redis  *redis.Client
    limit  int
    window time.Duration
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        key := rl.getKey(c)

        count, err := rl.redis.Incr(c.Request.Context(), key).Result()
        if err != nil {
            c.Next() // Fail open for availability
            return
        }

        if count == 1 {
            rl.redis.Expire(c.Request.Context(), key, rl.window)
        }

        // Set rate limit headers
        c.Header("X-RateLimit-Limit", strconv.Itoa(rl.limit))
        c.Header("X-RateLimit-Remaining", strconv.Itoa(max(0, rl.limit-int(count))))

        if count > int64(rl.limit) {
            ttl, _ := rl.redis.TTL(c.Request.Context(), key).Result()
            c.Header("Retry-After", strconv.Itoa(int(ttl.Seconds())))
            c.AbortWithStatusJSON(429, gin.H{
                "error": map[string]interface{}{
                    "code":    "RATE_LIMIT_EXCEEDED",
                    "message": "Too many requests. Please try again later.",
                    "details": map[string]interface{}{
                        "retry_after": int(ttl.Seconds()),
                    },
                },
            })
            return
        }

        c.Next()
    }
}
```

### 4.3 Security Headers

```go
// internal/infrastructure/middleware/security_headers.go

func SecurityHeaders() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Prevent clickjacking
        c.Header("X-Frame-Options", "DENY")

        // Prevent MIME sniffing
        c.Header("X-Content-Type-Options", "nosniff")

        // XSS protection
        c.Header("X-XSS-Protection", "1; mode=block")

        // Referrer policy
        c.Header("Referrer-Policy", "strict-origin-when-cross-origin")

        // Content Security Policy
        c.Header("Content-Security-Policy",
            "default-src 'self'; "+
            "script-src 'self'; "+
            "style-src 'self' 'unsafe-inline'; "+
            "img-src 'self' data: https:; "+
            "font-src 'self'; "+
            "connect-src 'self' https://api.agentinterface.example.com")

        // HSTS (only in production)
        if isProduction() {
            c.Header("Strict-Transport-Security",
                "max-age=31536000; includeSubDomains; preload")
        }

        // Permissions Policy
        c.Header("Permissions-Policy",
            "geolocation=(), camera=(), microphone=()")

        c.Next()
    }
}
```

### 4.4 CORS Configuration

```go
// internal/infrastructure/middleware/cors.go

func CORS(allowedOrigins []string) gin.HandlerFunc {
    return cors.New(cors.Config{
        AllowOrigins:     allowedOrigins,
        AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Authorization", "Content-Type", "X-Request-ID"},
        ExposeHeaders:    []string{"X-RateLimit-Limit", "X-RateLimit-Remaining"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    })
}

// Configuration
var allowedOrigins = []string{
    "https://agentinterface.example.com",     // Production
    "https://staging.agentinterface.example.com", // Staging
    "http://localhost:3000",                  // Development
}
```

### 4.5 Input Validation

```go
// internal/interfaces/http/requests/client.go

type CreateClientRequest struct {
    BuyerType     string `json:"buyer_type" validate:"required,oneof=principal-buyer co-buyer"`
    FirstName     string `json:"first_name" validate:"required,min=1,max=255"`
    LastName      string `json:"last_name" validate:"required,min=1,max=255"`
    MiddleName    string `json:"middle_name" validate:"omitempty,max=255"`
    Email         string `json:"email" validate:"required,email,max=255"`
    ContactNumber string `json:"contact_number" validate:"required,e164"` // E.164 format
    Gender        string `json:"gender" validate:"omitempty,oneof=male female"`
    Birthdate     string `json:"birthdate" validate:"omitempty,datetime=2006-01-02"`
}

// Validation middleware
func ValidateRequest[T any]() gin.HandlerFunc {
    return func(c *gin.Context) {
        var req T
        if err := c.ShouldBindJSON(&req); err != nil {
            c.AbortWithStatusJSON(400, gin.H{
                "error": map[string]interface{}{
                    "code":    "INVALID_REQUEST",
                    "message": "Invalid request body",
                },
            })
            return
        }

        if err := validate.Struct(&req); err != nil {
            validationErrors := formatValidationErrors(err)
            c.AbortWithStatusJSON(422, gin.H{
                "error": map[string]interface{}{
                    "code":    "VALIDATION_ERROR",
                    "message": "Request validation failed",
                    "details": map[string]interface{}{
                        "fields": validationErrors,
                    },
                },
            })
            return
        }

        c.Set("validatedRequest", req)
        c.Next()
    }
}
```

---

## 5. Data Protection

### 5.1 SQL Injection Prevention

Always use parameterized queries:

```go
// CORRECT - Parameterized query
func (r *MySQLAgentRepository) FindByID(ctx context.Context, id int64) (*Agent, error) {
    query := `SELECT * FROM re_agents WHERE id = ? AND deleted_at IS NULL`
    row := r.db.QueryRowContext(ctx, query, id)
    // ...
}

// WRONG - String concatenation (vulnerable)
// query := fmt.Sprintf("SELECT * FROM re_agents WHERE id = %d", id)
```

### 5.2 XSS Prevention

Sanitize output in responses:

```go
// Sanitize HTML entities in string fields
func SanitizeString(s string) string {
    return html.EscapeString(s)
}

// Apply to all user-provided content in DTOs
type ClientDTO struct {
    FirstName string `json:"first_name"`
    // ...
}

func ToClientDTO(client *domain.Client) ClientDTO {
    return ClientDTO{
        FirstName: SanitizeString(client.FirstName),
        // ...
    }
}
```

### 5.3 Sensitive Data Handling

```go
// Never log sensitive data
type LoginRequest struct {
    Email    string `json:"email"`
    Password string `json:"password" log:"-"` // Excluded from logging
}

// Mask sensitive fields in logs
func maskEmail(email string) string {
    parts := strings.Split(email, "@")
    if len(parts) != 2 {
        return "***"
    }
    if len(parts[0]) <= 2 {
        return "**@" + parts[1]
    }
    return parts[0][:2] + "***@" + parts[1]
}

// Encryption for sensitive stored data
// Use application-level encryption for PII if needed
```

### 5.4 Audit Logging

```go
// internal/infrastructure/audit/logger.go

type AuditEvent struct {
    Timestamp   time.Time              `json:"timestamp"`
    UserID      int64                  `json:"user_id"`
    AgentID     int64                  `json:"agent_id"`
    Action      string                 `json:"action"`
    Resource    string                 `json:"resource"`
    ResourceID  string                 `json:"resource_id"`
    IPAddress   string                 `json:"ip_address"`
    UserAgent   string                 `json:"user_agent"`
    Status      string                 `json:"status"` // success, failure
    Details     map[string]interface{} `json:"details,omitempty"`
}

func LogAuditEvent(ctx context.Context, event AuditEvent) {
    // Write to audit log (separate from application logs)
    // Consider using a dedicated audit service or table
}

// Usage in handlers
func (h *ClientHandler) CreateClient(c *gin.Context) {
    // ... create client logic ...

    LogAuditEvent(c.Request.Context(), AuditEvent{
        Timestamp:  time.Now(),
        UserID:     getUserID(c),
        AgentID:    getAgentID(c),
        Action:     "CREATE",
        Resource:   "client",
        ResourceID: strconv.FormatInt(newClient.ID, 10),
        IPAddress:  c.ClientIP(),
        UserAgent:  c.GetHeader("User-Agent"),
        Status:     "success",
    })
}
```

---

## 6. Implementation Guidelines

### 6.1 Security Checklist

#### Authentication
- [ ] Implement JWT with RS256 algorithm
- [ ] Set appropriate token lifetimes (15min access, 7d refresh)
- [ ] Implement token blacklisting for logout
- [ ] Use HttpOnly cookies for token storage
- [ ] Implement refresh token rotation

#### Authorization
- [ ] Implement RBAC with role hierarchy
- [ ] Enforce resource ownership checks
- [ ] Apply least privilege principle
- [ ] Log authorization failures

#### API Security
- [ ] Enable TLS 1.3
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Validate all inputs

#### Data Protection
- [ ] Use parameterized queries
- [ ] Sanitize output
- [ ] Hash passwords with bcrypt (cost 12)
- [ ] Encrypt sensitive data at rest
- [ ] Implement audit logging

### 6.2 Security Testing

| Test Type | Tools | Frequency |
|-----------|-------|-----------|
| Dependency Scanning | `go mod tidy`, Snyk | Every build |
| SAST (Static Analysis) | gosec, golangci-lint | Every PR |
| DAST (Dynamic Analysis) | OWASP ZAP | Weekly |
| Penetration Testing | Manual + automated | Quarterly |

### 6.3 Incident Response

1. **Detection**: Monitor for unusual patterns (failed logins, rate limit hits)
2. **Containment**: Ability to revoke all tokens for a user/session
3. **Investigation**: Comprehensive audit logs for forensics
4. **Recovery**: Documented procedures for security incidents

---

## Summary

This security documentation provides comprehensive guidance for:

- **Authentication**: JWT-based with proper token management
- **Authorization**: RBAC with resource-based policies
- **API Security**: Rate limiting, headers, CORS, validation
- **Data Protection**: SQL injection, XSS prevention, audit logging

Follow the implementation guidelines and security checklist to ensure a secure Agent Interface application.

For related documentation:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API_DESIGN.md](./API_DESIGN.md) - API specifications
