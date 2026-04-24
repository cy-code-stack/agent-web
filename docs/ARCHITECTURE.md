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
│      FRONTEND (Next.js)     │         │   BACKEND (Laravel API)     │
│                             │         │                             │
│  - Server-Side Rendering    │ ◄─────► │  - RESTful API              │
│  - Static Generation        │   API   │  - Business Logic           │
│  - React Components         │         │  - Sanctum Authentication   │
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

### Backend: Laravel 11 (PHP 8.3)

**Justification for Laravel:**

| Criteria                  | Laravel                                    |
| ------------------------- | ------------------------------------------ |
| **Developer Velocity**    | High — Artisan, Eloquent, auto-wiring      |
| **Auth**                  | Sanctum (Bearer tokens) out of the box     |
| **ORM**                   | Eloquent — maps directly to `re_` tables   |
| **Queue / Jobs**          | Built-in — Redis-backed async processing   |
| **Validation**            | Form Requests with declarative rules       |
| **DDD Support**           | Clean via Actions + Service + Repository   |
| **Ecosystem**             | Spatie packages, Horizon, Telescope        |
| **Deployment**            | Laravel Forge / Ploi — one-click PHP hosts |

**Laravel Package Stack:**

| Purpose              | Package                           | Rationale                                          |
| -------------------- | --------------------------------- | -------------------------------------------------- |
| Auth                 | **laravel/sanctum**               | Stateless Bearer token auth, token refresh         |
| Roles & Permissions  | **spatie/laravel-permission**     | Role-based access control per agent/manager        |
| API Filtering        | **spatie/laravel-query-builder**  | Filterable, sortable, includable APIs              |
| DTOs & Validation    | **spatie/laravel-data**           | Typed data objects with auto-validation            |
| Single-Action Classes| **lorisleiva/laravel-actions**    | One class per use case (maps directly to UC-xxx)   |
| Performance          | **laravel/octane** (Swoole)       | Persistent process — eliminates PHP bootstrap cost |
| API Documentation    | **dedoc/scramble**                | Auto-generate OpenAPI from code, zero annotations  |
| Queue Monitoring     | **laravel/horizon**               | Real-time Redis queue dashboard                    |

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

### Application Service Pattern (Laravel — Single-Action Class per Use Case)

```php
// app/Application/Client/ListAgentClients.php
namespace App\Application\Client;

use App\Domain\Client\Contracts\BuyerRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class ListAgentClients
{
    public function __construct(
        private readonly BuyerRepository $buyerRepo,
    ) {}

    public function handle(int $agentId, array $filters): LengthAwarePaginator
    {
        $cacheKey = "agent:{$agentId}:clients:" . md5(serialize($filters));

        // 1. Check Redis cache (5-min TTL, tagged for easy invalidation)
        return Cache::tags(["agent:{$agentId}", 'clients'])
            ->remember($cacheKey, now()->addMinutes(5), function () use ($agentId, $filters) {
                // 2. Query repository with filters
                return $this->buyerRepo->findByAgent(
                    agentId: $agentId,
                    search:  $filters['search']     ?? null,
                    perPage: $filters['per_page']   ?? 15,
                    sortBy:  $filters['sort_by']    ?? 'created_at',
                    order:   $filters['sort_order'] ?? 'desc',
                );
                // 3. Returns Eloquent paginator — mapped to BuyerResource in controller
            });
    }
}
```

---

## 6. Infrastructure Layer

### Repository Pattern (Laravel — Interface + Eloquent Implementation)

```php
// app/Domain/Agent/Contracts/AgentRepository.php
namespace App\Domain\Agent\Contracts;

interface AgentRepository
{
    public function findById(int $id): ?AgentModel;
    public function findByUserId(int $userId): ?AgentModel;
    public function findByReferralCode(string $code): ?AgentModel;
    public function save(AgentModel $agent): AgentModel;
    public function update(int $id, array $data): AgentModel;
}

// app/Infrastructure/Persistence/Repositories/EloquentAgentRepository.php
namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Agent\Contracts\AgentRepository;
use App\Infrastructure\Persistence\Eloquent\AgentModel;

class EloquentAgentRepository implements AgentRepository
{
    public function findById(int $id): ?AgentModel
    {
        return AgentModel::with(['user', 'realty'])
            ->where('id', $id)
            ->first();
    }

    public function findByReferralCode(string $code): ?AgentModel
    {
        return AgentModel::where('referral_code', $code)->first();
    }
}

// app/Infrastructure/Persistence/Eloquent/AgentModel.php  (maps to re_agents)
class AgentModel extends Model
{
    use SoftDeletes;
    protected $table = 're_agents';   // existing table — no migration needed
    protected $fillable = [
        'user_id', 'realty_id', 'realty_manager_id',
        'referral_code', 'appointment_ref_code',
        'first_name', 'last_name', 'middle_name', 'gender',
        'contact_number', 'agent_phone_num', 'agent_landline',
        'agent_country', 'agent_region', 'agent_province',
        'agent_city_mul', 'agent_brgy', 'agent_street',
        'agent_zip_code', 'is_institution', 'pag_ibig_id', 'tin',
    ];
    protected $casts = ['is_institution' => 'boolean'];
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

### Backend Directory Structure (Laravel 11)

```
backend/
├── app/
│   ├── Domain/                          # DOMAIN LAYER (pure PHP — no Laravel deps)
│   │   ├── Agent/
│   │   │   ├── Contracts/
│   │   │   │   └── AgentRepository.php  # Repository interface
│   │   │   ├── ValueObjects/
│   │   │   │   ├── ReferralCode.php
│   │   │   │   ├── PersonalInfo.php
│   │   │   │   ├── Address.php
│   │   │   │   └── ContactInfo.php
│   │   │   └── Services/
│   │   │       ├── ReferralCodeService.php
│   │   │       └── AppointmentRefCodeService.php
│   │   ├── Client/
│   │   │   ├── Contracts/
│   │   │   │   └── BuyerRepository.php
│   │   │   └── Services/
│   │   ├── Sales/
│   │   │   ├── Contracts/
│   │   │   └── Services/
│   │   │       ├── PricingCalculationService.php
│   │   │       └── SaleStatusTransitionService.php
│   │   ├── Incentive/
│   │   │   ├── Contracts/
│   │   │   └── Services/
│   │   │       ├── IncentiveCalculationService.php
│   │   │       └── IncentiveApprovalService.php
│   │   ├── Appointment/
│   │   │   └── Contracts/
│   │   ├── Property/
│   │   │   └── Contracts/
│   │   ├── Organization/
│   │   │   └── Contracts/
│   │   └── Shared/
│   │       ├── Money.php                # Money value object
│   │       ├── Address.php              # Shared address VO
│   │       └── DomainEvent.php          # Base domain event
│   │
│   ├── Application/                     # APPLICATION LAYER (use cases = Actions)
│   │   ├── Auth/
│   │   │   ├── LoginAgent.php           # UC-002
│   │   │   ├── RefreshToken.php         # UC-003
│   │   │   └── LogoutAgent.php          # UC-005
│   │   ├── Agent/
│   │   │   ├── GetAgentProfile.php      # UC-101
│   │   │   ├── UpdateAgentProfile.php   # UC-102
│   │   │   ├── GenerateReferralLink.php # UC-103
│   │   │   ├── GenerateAppointmentLink.php # UC-104
│   │   │   └── GetDashboardStats.php    # UC-105
│   │   ├── Client/
│   │   │   ├── ListAgentClients.php     # UC-201
│   │   │   ├── GetClientDetails.php     # UC-202
│   │   │   ├── AddNewClient.php         # UC-203
│   │   │   ├── UpdateClientInfo.php     # UC-204
│   │   │   └── ExportClientList.php     # UC-206
│   │   ├── Sales/
│   │   │   ├── ListAgentSales.php       # UC-301
│   │   │   └── GetSaleDetails.php       # UC-302
│   │   ├── Incentive/
│   │   │   ├── ListAgentIncentives.php  # UC-401
│   │   │   └── GetIncentiveDetails.php  # UC-402
│   │   └── Appointment/
│   │       ├── ScheduleSiteTour.php     # UC-501
│   │       ├── ListAppointments.php     # UC-502
│   │       └── UpdateAppointmentStatus.php # UC-503
│   │
│   ├── Infrastructure/                  # INFRASTRUCTURE LAYER (Laravel implementations)
│   │   ├── Persistence/
│   │   │   ├── Eloquent/
│   │   │   │   ├── AgentModel.php       # re_agents table
│   │   │   │   ├── BuyerModel.php       # re_buyers table
│   │   │   │   ├── SaleModel.php        # re_sales table
│   │   │   │   ├── IncentiveModel.php   # re_agent_incentives table
│   │   │   │   ├── AppointmentModel.php # re_site_tour_appointments table
│   │   │   │   ├── ProjectModel.php     # re_projects table
│   │   │   │   └── UserModel.php        # users table
│   │   │   └── Repositories/
│   │   │       ├── EloquentAgentRepository.php
│   │   │       ├── EloquentBuyerRepository.php
│   │   │       ├── EloquentSaleRepository.php
│   │   │       └── EloquentIncentiveRepository.php
│   │   └── External/
│   │       ├── SemaphoreSmsService.php  # Philippine SMS
│   │       ├── MailNotificationService.php
│   │       └── S3FileStorageService.php
│   │
│   ├── Http/                            # INTERFACE LAYER (Laravel HTTP)
│   │   ├── Controllers/
│   │   │   └── Api/V1/
│   │   │       ├── AuthController.php
│   │   │       ├── AgentController.php
│   │   │       ├── ClientController.php
│   │   │       ├── SalesController.php
│   │   │       ├── IncentiveController.php
│   │   │       └── AppointmentController.php
│   │   ├── Requests/                    # Form Request validation
│   │   │   ├── Auth/LoginRequest.php
│   │   │   ├── Agent/UpdateAgentRequest.php
│   │   │   ├── Client/StoreClientRequest.php
│   │   │   └── Appointment/StoreAppointmentRequest.php
│   │   ├── Resources/                   # API response transformers
│   │   │   ├── AgentResource.php
│   │   │   ├── BuyerResource.php
│   │   │   ├── BuyerCollection.php
│   │   │   ├── SaleResource.php
│   │   │   ├── IncentiveResource.php
│   │   │   └── AppointmentResource.php
│   │   └── Middleware/
│   │       ├── ForceJsonResponse.php
│   │       └── EnsureAgentOwnership.php
│   │
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── DomainServiceProvider.php    # Bind interfaces → implementations
│
├── routes/
│   └── api.php                          # All /api/v1/* routes
│
├── config/
│   ├── sanctum.php
│   ├── cors.php
│   └── queue.php
│
├── database/
│   └── migrations/                      # Only for NEW tables; re_ tables unchanged
│
├── Dockerfile
├── docker-compose.yml
├── composer.json
└── artisan
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
│  Client  │         │   Next.js    │         │  Laravel │         │  MySQL  │
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
     │                      │                      │  5. Sanctum Issue  │
     │                      │                      │  Bearer Token pair │
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
│  Client  │         │   Next.js    │         │  Laravel │    │ Redis │    │  MySQL  │
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
│  Client  │         │   Next.js    │         │  Laravel │         │  MySQL  │
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

- **Laravel 11 backend** with clean architecture and DDD principles (Actions + Repository + Domain Services)
- **Next.js 14+ frontend** with modern React patterns (App Router, TanStack Query, Zustand)
- **MySQL database** leveraging the existing `marrea-local` schema with `re_` table prefix — no destructive migrations
- **Redis** for caching (tagged cache invalidation) and queue backend (Horizon)

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
