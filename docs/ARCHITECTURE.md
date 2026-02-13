# Agent Interface System Architecture

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Domain-Driven Design (DDD)](#3-domain-driven-design-ddd)
4. [Domain Model](#4-domain-model)
5. [Application Layer](#5-application-layer)
6. [Infrastructure Layer](#6-infrastructure-layer)
7. [Module Breakdown](#7-module-breakdown)
8. [Data Flow](#8-data-flow)

---

## 1. System Overview

The Agent Interface is a web application designed for real estate agents to manage their business operations. The system provides the following core features:

| Feature                    | Description                                |
| -------------------------- | ------------------------------------------ |
| **Client Lists**           | Manage and track buyer/client information  |
| **Agent Incentives**       | View and track commission incentives       |
| **Referral Links**         | Generate and share referral tracking links |
| **Site Tour Appointments** | Schedule and manage property site tours    |

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
│                    (Web Browsers, Mobile Devices)                        │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ HTTPS
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           CDN / WAF Layer                                │
│                         (CloudFlare / AWS CloudFront)                    │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
              ┌───────────────────┴───────────────────┐
              │                                       │
              ▼                                       ▼
┌─────────────────────────────┐         ┌─────────────────────────────┐
│      FRONTEND (Next.js)     │         │      BACKEND (Go API)       │
│                             │         │                             │
│  - Server-Side Rendering    │ ◄─────► │  - RESTful API              │
│  - Static Generation        │   API   │  - Business Logic           │
│  - React Components         │         │  - Authentication           │
│  - Client State Management  │         │  - Authorization            │
└─────────────────────────────┘         └──────────────┬──────────────┘
                                                       │
                                    ┌──────────────────┼──────────────────┐
                                    │                  │                  │
                                    ▼                  ▼                  ▼
                          ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                          │    MySQL    │    │    Redis    │    │  File Store │
                          │  (Primary)  │    │   (Cache)   │    │    (S3)     │
                          └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 2. Technology Stack

### Backend: Go (Golang)

**Justification for Go over Node.js:**

| Criteria                 | Go                               | Node.js                    |
| ------------------------ | -------------------------------- | -------------------------- |
| **Memory Footprint**     | ~10-20MB per instance            | ~50-100MB per instance     |
| **Concurrency Model**    | Goroutines (2KB stack)           | Event loop + async/await   |
| **10K Concurrent Users** | Single instance sufficient       | Multiple instances needed  |
| **Type Safety**          | Compile-time static typing       | Runtime (TypeScript helps) |
| **Deployment**           | Single binary, zero dependencies | Requires Node.js runtime   |
| **CPU-Bound Tasks**      | Excellent                        | Poor (single-threaded)     |
| **Startup Time**         | Milliseconds                     | Seconds                    |

**Go Library Stack:**

| Purpose           | Library                     | Rationale                                           |
| ----------------- | --------------------------- | --------------------------------------------------- |
| Web Framework     | **Gin**                     | High performance, middleware support, battle-tested |
| ORM               | **GORM**                    | Feature-rich, MySQL support, migrations             |
| Validation        | **go-playground/validator** | Struct tag validation, custom rules                 |
| JWT               | **golang-jwt/jwt**          | Standard JWT implementation                         |
| Configuration     | **Viper**                   | Multi-format config, env variables                  |
| Logging           | **Zap**                     | High-performance structured logging                 |
| API Documentation | **Swaggo**                  | Auto-generate OpenAPI from annotations              |

### Frontend: Next.js 14+

| Purpose          | Library                   | Rationale                                  |
| ---------------- | ------------------------- | ------------------------------------------ |
| UI Components    | **shadcn/ui**             | Accessible, customizable, Tailwind-based   |
| Styling          | **Tailwind CSS**          | Utility-first, consistent design           |
| State Management | **Zustand**               | Lightweight, TypeScript-friendly           |
| Data Fetching    | **TanStack Query**        | Caching, background updates, optimistic UI |
| HTTP Client      | **Axios**                 | Interceptors, error handling               |
| Forms            | **React Hook Form + Zod** | Performance, schema validation             |

### Database: MySQL

- **Version**: 8.0+
- **Connection**: Existing `marrea-local` database
- **Table Prefix**: `re_` for real estate tables

### Caching: Redis

- **Version**: 7.0+
- **Use Cases**: Session storage, API response caching, rate limiting

---

## 3. Domain-Driven Design (DDD)

### Bounded Contexts

The system is divided into 8 bounded contexts, each with clear boundaries and responsibilities:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT INTERFACE SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   CORE DOMAIN                                                                │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │                                                                    │    │
│   │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │    │
│   │  │    AGENT     │    │    CLIENT    │    │  INCENTIVE   │         │    │
│   │  │   CONTEXT    │    │   CONTEXT    │    │   CONTEXT    │         │    │
│   │  │              │    │              │    │              │         │    │
│   │  │ - Profile    │    │ - Buyers     │    │ - Incentives │         │    │
│   │  │ - Referral   │◄──►│ - Relations  │◄──►│ - Approval   │         │    │
│   │  │ - Appt Links │    │              │    │ - Payout     │         │    │
│   │  └──────────────┘    └──────────────┘    └──────────────┘         │    │
│   │                                                                    │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│   SUPPORTING DOMAIN                                                          │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │                                                                    │    │
│   │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │    │
│   │  │    SALES     │    │   PROPERTY   │    │ APPOINTMENT  │         │    │
│   │  │   CONTEXT    │    │   CONTEXT    │    │   CONTEXT    │         │    │
│   │  │              │    │              │    │              │         │    │
│   │  │ - Sales      │    │ - Projects   │    │ - Site Tours │         │    │
│   │  │ - Payments   │    │ - Units      │    │ - Scheduling │         │    │
│   │  │ - Status     │    │ - Pricing    │    │ - Status     │         │    │
│   │  └──────────────┘    └──────────────┘    └──────────────┘         │    │
│   │                                                                    │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│   GENERIC SUBDOMAIN                                                          │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │                                                                    │    │
│   │  ┌──────────────┐    ┌──────────────┐                              │    │
│   │  │  IDENTITY &  │    │ ORGANIZATION │                              │    │
│   │  │    ACCESS    │    │   CONTEXT    │                              │    │
│   │  │              │    │              │                              │    │
│   │  │ - Users      │    │ - Realties   │                              │    │
│   │  │ - Auth/JWT   │    │ - Managers   │                              │    │
│   │  │ - Roles      │    │ - Hierarchy  │                              │    │
│   │  └──────────────┘    └──────────────┘                              │    │
│   │                                                                    │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Context Responsibilities

| Context               | Responsibility                                       | Key Aggregates        |
| --------------------- | ---------------------------------------------------- | --------------------- |
| **Identity & Access** | Authentication, authorization, user management       | User                  |
| **Agent**             | Agent profile management, referral/appointment codes | Agent                 |
| **Client**            | Buyer information, agent-client relationships        | Buyer                 |
| **Sales**             | Sales transactions, payments, status tracking        | Sale                  |
| **Incentive**         | Commission calculation, approval workflow            | AgentIncentive        |
| **Property**          | Project and unit inventory                           | Project, Unit         |
| **Appointment**       | Site tour scheduling and management                  | SiteTourAppointment   |
| **Organization**      | Realty company structure, management hierarchy       | Realty, RealtyManager |

### Context Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CONTEXT MAP                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌──────────────┐                                                         │
│    │  Identity &  │                                                         │
│    │    Access    │ ──────────────────────────────────────────┐             │
│    │   (UPSTREAM) │                                           │             │
│    └──────┬───────┘                                           │             │
│           │ U/D                                                │ U/D         │
│           ▼                                                    ▼             │
│    ┌──────────────┐    Partnership    ┌──────────────┐    ┌──────────────┐  │
│    │    Agent     │◄─────────────────►│    Client    │    │ Organization │  │
│    │   Context    │                   │   Context    │    │   Context    │  │
│    └──────┬───────┘                   └──────┬───────┘    └──────────────┘  │
│           │                                  │                              │
│           │ U/D                              │ U/D                          │
│           ▼                                  ▼                              │
│    ┌──────────────┐    Conformist     ┌──────────────┐                     │
│    │  Incentive   │◄──────────────────│    Sales     │                     │
│    │   Context    │                   │   Context    │                     │
│    └──────────────┘                   └──────┬───────┘                     │
│                                              │                              │
│                                              │ U/D                          │
│                                              ▼                              │
│    ┌──────────────┐                   ┌──────────────┐                     │
│    │ Appointment  │◄──── Shared ─────►│   Property   │                     │
│    │   Context    │      Kernel       │   Context    │                     │
│    └──────────────┘                   └──────────────┘                     │
│                                                                              │
│    Legend: U/D = Upstream/Downstream                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Domain Model

### 4.1 Agent Context

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT AGGREGATE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Agent (Aggregate Root)                            │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  - id: AgentID                                                       │    │
│  │  - userId: UserID                                                    │    │
│  │  - realtyId: RealtyID (optional)                                    │    │
│  │  - managerId: ManagerID (optional)                                  │    │
│  │  - referralCode: ReferralCode (Value Object)                        │    │
│  │  - appointmentRefCode: AppointmentRefCode (Value Object)            │    │
│  │  - personalInfo: PersonalInfo (Value Object)                        │    │
│  │  - address: Address (Value Object)                                  │    │
│  │  - contactInfo: ContactInfo (Value Object)                          │    │
│  │  - isInstitution: boolean                                           │    │
│  │  - brokerProfile: BrokerProfile (optional Entity)                   │    │
│  │  - timestamps: AuditTimestamps                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Value Objects:                                                              │
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │    PersonalInfo     │  │       Address       │  │    ContactInfo      │  │
│  ├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤  │
│  │ - firstName         │  │ - country           │  │ - phone             │  │
│  │ - lastName          │  │ - region            │  │ - landline          │  │
│  │ - middleName        │  │ - province          │  │ - email             │  │
│  │ - gender            │  │ - city              │  └─────────────────────┘  │
│  │ - pagIbigId         │  │ - barangay          │                           │
│  │ - tin               │  │ - street            │  ┌─────────────────────┐  │
│  └─────────────────────┘  │ - unit              │  │    ReferralCode     │  │
│                           │ - buildingName      │  ├─────────────────────┤  │
│                           │ - houseNo           │  │ - value: string     │  │
│                           │ - subdivision       │  │ + Generate()        │  │
│                           │ - zipCode           │  │ + Validate()        │  │
│                           └─────────────────────┘  │ + BuildLink(base)   │  │
│                                                    └─────────────────────┘  │
│                                                                              │
│  Domain Services:                                                            │
│  - ReferralCodeService: Generate, validate, resolve agent from code         │
│  - AppointmentRefCodeService: Generate codes, build appointment URLs        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Client Context

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BUYER AGGREGATE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Buyer (Aggregate Root)                            │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  - id: BuyerID                                                       │    │
│  │  - userId: UserID (optional - if registered)                        │    │
│  │  - buyerType: BuyerType (principal-buyer | co-buyer)                │    │
│  │  - personalInfo: BuyerPersonalInfo (Value Object)                   │    │
│  │  - contactInfo: BuyerContactInfo (Value Object)                     │    │
│  │  - address: BuyerAddress (Value Object)                             │    │
│  │  - employmentInfo: EmploymentInfo (Value Object)                    │    │
│  │  - spouse: SpouseInfo (optional Value Object)                       │    │
│  │  - coBuyer: CoBuyerInfo (optional Value Object)                     │    │
│  │  - spa: SpecialPowerOfAttorney (optional Value Object)              │    │
│  │  - eSignature: Signature (optional Value Object)                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              AgentBuyerRelationship (Entity)                         │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  - agentId: AgentID                                                  │    │
│  │  - buyerId: BuyerID                                                  │    │
│  │  - assignedAt: Timestamp                                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Incentive Context

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AGENT INCENTIVE AGGREGATE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              AgentIncentive (Aggregate Root)                         │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  - id: IncentiveID                                                   │    │
│  │  - agentId: AgentID                                                  │    │
│  │  - saleId: SaleID                                                    │    │
│  │  - unitId: UnitID                                                    │    │
│  │  - approvedByUserId: UserID (optional)                              │    │
│  │  - requestedByUserId: UserID (optional)                             │    │
│  │  - totalIncentive: Money (Value Object)                             │    │
│  │  - status: IncentiveStatus (pending|approved|rejected|paid)         │    │
│  │  - items: List<IncentiveItem> (Entity)                              │    │
│  │  - dateNeeded: Date (optional)                                      │    │
│  │  - rfpAttachment: FileReference (optional)                          │    │
│  │  - remarks: string (optional)                                       │    │
│  │  - rejectionReason: string (optional)                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                   IncentiveItem (Entity)                             │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  - id: ItemID                                                        │    │
│  │  - incentiveType: IncentiveType (commission|bonus|override|etc)     │    │
│  │  - amount: Money (Value Object)                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Domain Services:                                                            │
│  - IncentiveCalculationService: Calculate incentive based on sale           │
│  - IncentiveApprovalService: Manage approval workflow                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Sales Context

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SALE AGGREGATE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Sale (Aggregate Root)                             │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  - id: SaleID                                                        │    │
│  │  - buyerId: BuyerID                                                  │    │
│  │  - agentId: AgentID (optional)                                      │    │
│  │  - projectId: ProjectID                                              │    │
│  │  - unitId: UnitID                                                    │    │
│  │  - preparedByUserId: UserID (optional)                              │    │
│  │  - reservation: ReservationDetails (Value Object)                   │    │
│  │  - pricing: PricingDetails (Value Object)                           │    │
│  │  - equity: EquityDetails (Value Object)                             │    │
│  │  - deferred: DeferredPayment (optional Value Object)                │    │
│  │  - financing: FinancingInfo (Value Object)                          │    │
│  │  - status: SaleStatus (pending|approved|cancelled|completed)        │    │
│  │  - checks: List<SaleCheck> (Entity)                                 │    │
│  │  - attachments: List<SaleAttachment> (Entity)                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Value Objects:                                                              │
│                                                                              │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐     │
│  │ ReservationDetails │  │   PricingDetails   │  │   EquityDetails    │     │
│  ├────────────────────┤  ├────────────────────┤  ├────────────────────┤     │
│  │ - date             │  │ - tcp              │  │ - hasEquity        │     │
│  │ - fee              │  │ - tcpVat           │  │ - equityNet        │     │
│  │ - promoCode        │  │ - discount         │  │ - equityTerms      │     │
│  └────────────────────┘  │ - dpPercentage     │  │ - monthlyEquity    │     │
│                          │ - dpAmount         │  │ - startDate        │     │
│                          │ - totalPaid        │  │ - endDate          │     │
│                          │ - balance          │  └────────────────────┘     │
│                          └────────────────────┘                             │
│                                                                              │
│  Domain Services:                                                            │
│  - PricingCalculationService: TCP, down payment, equity calculations        │
│  - SaleStatusTransitionService: Manage sale status workflow                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Application Layer

### Use Cases by Context

| Context         | Use Case | Description               |
| --------------- | -------- | ------------------------- |
| **Identity**    | UC-001   | Register Agent User       |
| **Identity**    | UC-002   | Authenticate User (Login) |
| **Identity**    | UC-003   | Refresh Access Token      |
| **Identity**    | UC-004   | Reset Password            |
| **Identity**    | UC-005   | Logout                    |
| **Agent**       | UC-101   | Get Agent Profile         |
| **Agent**       | UC-102   | Update Agent Profile      |
| **Agent**       | UC-103   | Generate Referral Link    |
| **Agent**       | UC-104   | Generate Appointment Link |
| **Agent**       | UC-105   | Get Dashboard Statistics  |
| **Client**      | UC-201   | List Agent's Clients      |
| **Client**      | UC-202   | Get Client Details        |
| **Client**      | UC-203   | Add New Client            |
| **Client**      | UC-204   | Update Client Information |
| **Client**      | UC-205   | Search Clients            |
| **Client**      | UC-206   | Export Client List        |
| **Sales**       | UC-301   | List Agent's Sales        |
| **Sales**       | UC-302   | Get Sale Details          |
| **Sales**       | UC-303   | View Payment History      |
| **Incentive**   | UC-401   | List Agent's Incentives   |
| **Incentive**   | UC-402   | Get Incentive Details     |
| **Appointment** | UC-501   | Schedule Site Tour        |
| **Appointment** | UC-502   | List Appointments         |
| **Appointment** | UC-503   | Update Appointment Status |

### Application Service Pattern (Go)

```go
// internal/application/client/service.go
type ClientApplicationService struct {
    buyerRepo      domain.BuyerRepository
    agentBuyerRepo domain.AgentBuyerRepository
    cache          cache.CacheService
    logger         *zap.Logger
}

type ListClientsInput struct {
    AgentID   int64
    Page      int
    PerPage   int
    Search    string
    SortBy    string
    SortOrder string
}

type ListClientsOutput struct {
    Clients    []ClientSummaryDTO
    Total      int64
    Page       int
    PerPage    int
    TotalPages int
}

func (s *ClientApplicationService) ListClients(ctx context.Context, input ListClientsInput) (*ListClientsOutput, error) {
    // 1. Validate input
    // 2. Check cache
    // 3. Query repository
    // 4. Map to DTOs
    // 5. Cache result
    // 6. Return output
}
```

---

## 6. Infrastructure Layer

### Repository Pattern

```go
// internal/domain/agent/repository.go
type AgentRepository interface {
    FindByID(ctx context.Context, id AgentID) (*Agent, error)
    FindByUserID(ctx context.Context, userID UserID) (*Agent, error)
    FindByReferralCode(ctx context.Context, code ReferralCode) (*Agent, error)
    Save(ctx context.Context, agent *Agent) error
    Update(ctx context.Context, agent *Agent) error
}

// internal/infrastructure/persistence/mysql/agent_repository.go
type MySQLAgentRepository struct {
    db *sqlx.DB
}

func (r *MySQLAgentRepository) FindByID(ctx context.Context, id domain.AgentID) (*domain.Agent, error) {
    query := `
        SELECT id, user_id, realty_id, realty_manager_id, referral_code,
               appointment_ref_code, first_name, last_name, middle_name,
               gender, contact_number, home_address, is_institution,
               pag_ibig_id, tin, agent_country, agent_region, agent_province,
               agent_city_mul, agent_brgy, agent_unit, building_name,
               house_no, agent_street, agent_subdivision, agent_zip_code,
               agent_landline, agent_phone_num, created_at, updated_at
        FROM re_agents
        WHERE id = ? AND deleted_at IS NULL
    `
    // Execute and map to domain entity
}
```

### External Services

| Service                 | Purpose                        | Implementation            |
| ----------------------- | ------------------------------ | ------------------------- |
| **NotificationService** | Email, SMS, Push notifications | SMTP, Semaphore, Firebase |
| **FileStorageService**  | Document uploads               | AWS S3 / MinIO            |
| **SMSService**          | Philippine SMS provider        | Semaphore API             |
| **EmailService**        | Transactional emails           | SMTP / SendGrid           |

---

## 7. Module Breakdown

### Backend Directory Structure (Go)

```
backend/
├── cmd/
│   └── api/
│       └── main.go                      # Application entry point
│
├── internal/
│   ├── domain/                          # DOMAIN LAYER
│   │   ├── agent/
│   │   │   ├── entity.go                # Agent aggregate
│   │   │   ├── value_objects.go         # PersonalInfo, Address, etc.
│   │   │   ├── repository.go            # Repository interface
│   │   │   └── service.go               # Domain services
│   │   ├── client/
│   │   │   ├── entity.go                # Buyer aggregate
│   │   │   ├── value_objects.go
│   │   │   └── repository.go
│   │   ├── sales/
│   │   │   ├── entity.go
│   │   │   ├── value_objects.go
│   │   │   ├── repository.go
│   │   │   └── service.go
│   │   ├── incentive/
│   │   │   ├── entity.go
│   │   │   ├── value_objects.go
│   │   │   ├── repository.go
│   │   │   └── service.go
│   │   ├── appointment/
│   │   │   ├── entity.go
│   │   │   ├── value_objects.go
│   │   │   └── repository.go
│   │   ├── property/
│   │   │   ├── entity.go
│   │   │   ├── value_objects.go
│   │   │   └── repository.go
│   │   ├── organization/
│   │   │   ├── entity.go
│   │   │   ├── value_objects.go
│   │   │   └── repository.go
│   │   └── shared/
│   │       ├── money.go                 # Money value object
│   │       ├── address.go               # Shared address VO
│   │       └── events.go                # Domain events
│   │
│   ├── application/                     # APPLICATION LAYER
│   │   ├── agent/
│   │   │   ├── service.go
│   │   │   ├── dto.go
│   │   │   └── mapper.go
│   │   ├── client/
│   │   │   ├── service.go
│   │   │   ├── dto.go
│   │   │   └── mapper.go
│   │   ├── sales/
│   │   │   └── ...
│   │   ├── incentive/
│   │   │   └── ...
│   │   ├── appointment/
│   │   │   └── ...
│   │   ├── property/
│   │   │   └── ...
│   │   └── auth/
│   │       ├── service.go
│   │       └── dto.go
│   │
│   ├── infrastructure/                  # INFRASTRUCTURE LAYER
│   │   ├── persistence/
│   │   │   └── mysql/
│   │   │       ├── config.go
│   │   │       ├── agent_repository.go
│   │   │       ├── client_repository.go
│   │   │       ├── sales_repository.go
│   │   │       └── ...
│   │   ├── cache/
│   │   │   ├── redis.go
│   │   │   ├── cache_service.go
│   │   │   └── keys.go
│   │   ├── auth/
│   │   │   ├── jwt_service.go
│   │   │   └── password_service.go
│   │   ├── external/
│   │   │   ├── notification_service.go
│   │   │   ├── sms_service.go
│   │   │   ├── email_service.go
│   │   │   └── file_storage_service.go
│   │   └── middleware/
│   │       ├── auth.go
│   │       ├── rate_limiter.go
│   │       ├── cors.go
│   │       ├── logging.go
│   │       └── recovery.go
│   │
│   └── interfaces/                      # INTERFACE LAYER
│       └── http/
│           ├── router.go
│           ├── handlers/
│           │   ├── auth_handler.go
│           │   ├── agent_handler.go
│           │   ├── client_handler.go
│           │   └── ...
│           ├── requests/
│           │   └── ...
│           └── responses/
│               └── ...
│
├── pkg/                                 # Shared packages
│   ├── validator/
│   ├── logger/
│   └── errors/
│
├── config/
│   ├── config.go
│   └── config.yaml
│
├── docs/
│   └── swagger/
│
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── go.mod
└── go.sum
```

### Frontend Directory Structure (Next.js)

```
frontend/
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Dashboard home
│   │   │   ├── profile/page.tsx
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── sales/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── incentives/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── appointments/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── schedule/page.tsx
│   │   │   └── links/page.tsx           # Referral & appointment links
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── mobile-nav.tsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── clients/
│   │   │   ├── sales/
│   │   │   ├── incentives/
│   │   │   ├── appointments/
│   │   │   └── links/
│   │   └── shared/
│   │
│   ├── lib/
│   │   ├── api/                         # API client functions
│   │   ├── hooks/                       # Custom React hooks
│   │   ├── store/                       # Zustand stores
│   │   ├── utils/                       # Utility functions
│   │   └── constants/
│   │
│   ├── types/                           # TypeScript types
│   │
│   └── styles/
│       └── globals.css
│
├── public/
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 8. Data Flow

### Authentication Flow

```
┌──────────┐         ┌──────────────┐         ┌──────────┐         ┌─────────┐
│  Client  │         │   Next.js    │         │  Go API  │         │  MySQL  │
└────┬─────┘         └──────┬───────┘         └────┬─────┘         └────┬────┘
     │                      │                      │                    │
     │  1. Login Form       │                      │                    │
     │─────────────────────►│                      │                    │
     │                      │                      │                    │
     │                      │  2. POST /auth/login │                    │
     │                      │─────────────────────►│                    │
     │                      │                      │                    │
     │                      │                      │  3. Verify User    │
     │                      │                      │───────────────────►│
     │                      │                      │                    │
     │                      │                      │  4. User Data      │
     │                      │                      │◄───────────────────│
     │                      │                      │                    │
     │                      │                      │  5. Generate JWT   │
     │                      │                      │  (Access+Refresh)  │
     │                      │                      │                    │
     │                      │  6. JWT Tokens       │                    │
     │                      │◄─────────────────────│                    │
     │                      │                      │                    │
     │  7. Set Cookies      │                      │                    │
     │  Redirect Dashboard  │                      │                    │
     │◄─────────────────────│                      │                    │
     │                      │                      │                    │
```

### Client List Data Flow

```
┌──────────┐         ┌──────────────┐         ┌──────────┐    ┌───────┐    ┌─────────┐
│  Client  │         │   Next.js    │         │  Go API  │    │ Redis │    │  MySQL  │
└────┬─────┘         └──────┬───────┘         └────┬─────┘    └───┬───┘    └────┬────┘
     │                      │                      │              │            │
     │  1. View Clients     │                      │              │            │
     │─────────────────────►│                      │              │            │
     │                      │                      │              │            │
     │                      │  2. GET /clients     │              │            │
     │                      │  Authorization: JWT  │              │            │
     │                      │─────────────────────►│              │            │
     │                      │                      │              │            │
     │                      │                      │  3. Check    │            │
     │                      │                      │     Cache    │            │
     │                      │                      │─────────────►│            │
     │                      │                      │              │            │
     │                      │                      │  4. Cache    │            │
     │                      │                      │     Miss     │            │
     │                      │                      │◄─────────────│            │
     │                      │                      │              │            │
     │                      │                      │  5. Query    │            │
     │                      │                      │     DB       │            │
     │                      │                      │─────────────────────────►│
     │                      │                      │              │            │
     │                      │                      │  6. Client   │            │
     │                      │                      │     Data     │            │
     │                      │                      │◄─────────────────────────│
     │                      │                      │              │            │
     │                      │                      │  7. Cache    │            │
     │                      │                      │     Result   │            │
     │                      │                      │─────────────►│            │
     │                      │                      │              │            │
     │                      │  8. JSON Response    │              │            │
     │                      │◄─────────────────────│              │            │
     │                      │                      │              │            │
     │  9. Render UI        │                      │              │            │
     │◄─────────────────────│                      │              │            │
     │                      │                      │              │            │
```

### Referral Link Generation Flow

```
┌──────────┐         ┌──────────────┐         ┌──────────┐         ┌─────────┐
│  Client  │         │   Next.js    │         │  Go API  │         │  MySQL  │
└────┬─────┘         └──────┬───────┘         └────┬─────┘         └────┬────┘
     │                      │                      │                    │
     │  1. Get Referral     │                      │                    │
     │     Link             │                      │                    │
     │─────────────────────►│                      │                    │
     │                      │                      │                    │
     │                      │  2. GET /agents/me/  │                    │
     │                      │     referral-link    │                    │
     │                      │─────────────────────►│                    │
     │                      │                      │                    │
     │                      │                      │  3. Get Agent      │
     │                      │                      │───────────────────►│
     │                      │                      │                    │
     │                      │                      │  4. Agent with     │
     │                      │                      │     referral_code  │
     │                      │                      │◄───────────────────│
     │                      │                      │                    │
     │                      │                      │  5. Build Link:    │
     │                      │                      │  {base}?ref={code} │
     │                      │                      │                    │
     │                      │  6. Response:        │                    │
     │                      │  {code, link}        │                    │
     │                      │◄─────────────────────│                    │
     │                      │                      │                    │
     │  7. Display Link     │                      │                    │
     │     with Copy Button │                      │                    │
     │◄─────────────────────│                      │                    │
     │                      │                      │                    │
```

---

## Summary

This architecture document provides a comprehensive guide for implementing the Agent Interface system using:

- **Go backend** with clean architecture and DDD principles
- **Next.js frontend** with modern React patterns
- **MySQL database** leveraging the existing marrea-local schema
- **Redis caching** for performance optimization

The modular structure allows for:

- Independent development and testing of bounded contexts
- Easy scaling of individual services
- Clear separation of concerns
- Maintainable and extensible codebase

Refer to the companion documents for detailed specifications:

- [API_DESIGN.md](./API_DESIGN.md) - API endpoint documentation
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database relationships
- [SECURITY.md](./SECURITY.md) - Security implementation
- [SCALABILITY.md](./SCALABILITY.md) - Scaling strategies
