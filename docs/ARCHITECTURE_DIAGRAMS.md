# Agent Interface Architecture Diagrams

## 1. High-Level Architecture

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

## 2. Bounded Contexts

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

---

## 3. Context Map

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

## 4. Agent Aggregate

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

---

## 5. Buyer Aggregate

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

---

## 6. Agent Incentive Aggregate

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

---

## 7. Sale Aggregate

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

## 8. Authentication Flow

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

---

## 9. Client List Data Flow

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

---

## 10. Referral Link Generation Flow

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
