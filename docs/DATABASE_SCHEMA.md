# Database Schema Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Entity Relationship Diagram](#2-entity-relationship-diagram)
3. [Core Tables](#3-core-tables)
4. [Table Relationships](#4-table-relationships)
5. [Index Strategy](#5-index-strategy)
6. [Data Dictionary](#6-data-dictionary)

---

## 1. Overview

### Database Information

| Property | Value |
|----------|-------|
| **Database Name** | `marrea-local` |
| **Database Engine** | MySQL 8.0+ |
| **Character Set** | utf8mb4 |
| **Collation** | utf8mb4_unicode_ci |
| **Table Prefix** | `re_` (for real estate tables) |

### Connection Configuration

```yaml
host: 127.0.0.1
port: 3306
database: marrea-local
charset: utf8mb4
collation: utf8mb4_unicode_ci
```

---

## 2. Entity Relationship Diagram

### Text-Based ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                     │
│                         Agent Interface System                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │    users    │
                                    │─────────────│
                                    │ PK: id      │
                                    │    name     │
                                    │    email    │
                                    │    password │
                                    └──────┬──────┘
                                           │
                                           │ 1:1
                                           ▼
┌─────────────────┐                ┌─────────────────┐                ┌─────────────────┐
│   re_realties   │                │   re_agents     │                │ re_realty_mgrs  │
│─────────────────│                │─────────────────│                │─────────────────│
│ PK: id          │◄───────────────│ FK: realty_id   │───────────────►│ PK: id          │
│    name         │      N:1       │ FK: user_id     │      N:1       │ FK: realty_id   │
│    contact      │                │ FK: mgr_id      │◄───────────────│ FK: agent_id    │
│    detail       │                │    referral_code│                │    role         │
└─────────────────┘                │    appt_ref_code│                └─────────────────┘
                                   │    first_name   │
                                   │    last_name    │
                                   │    ...          │
                                   └────────┬────────┘
                                            │
                           ┌────────────────┼────────────────┐
                           │                │                │
                           │ 1:N            │ M:N            │ 1:N
                           ▼                ▼                ▼
                   ┌───────────────┐ ┌─────────────┐ ┌─────────────────┐
                   │   re_sales    │ │re_agent_    │ │agent_incentives │
                   │───────────────│ │buyers       │ │─────────────────│
                   │ PK: id        │ │─────────────│ │ PK: id          │
                   │ FK: agent_id  │ │ FK: agent_id│ │ FK: agent_id    │
                   │ FK: buyer_id  │ │ FK: buyer_id│ │ FK: sale_id     │
                   │ FK: project_id│ └──────┬──────┘ │ FK: unit_id     │
                   │ FK: unit_id   │        │        │    total        │
                   │    tcp        │        │        │    status       │
                   │    status     │        │        └─────────────────┘
                   │    ...        │        │
                   └───────┬───────┘        │
                           │                │
                           │                │
                           ▼                ▼
                   ┌───────────────────────────────┐
                   │          re_buyers            │
                   │───────────────────────────────│
                   │ PK: id                        │
                   │ FK: user_id (optional)        │
                   │    buyer_type                 │
                   │    first_name                 │
                   │    last_name                  │
                   │    email                      │
                   │    contact_number             │
                   │    ... (personal info)        │
                   │    ... (employment info)      │
                   │    ... (spouse info)          │
                   └───────────────────────────────┘

                   ┌───────────────┐        ┌───────────────────┐
                   │   projects    │        │ vertical_project_ │
                   │───────────────│        │ units             │
                   │ PK: id        │◄───────│───────────────────│
                   │    name       │  N:1   │ PK: id            │
                   │    location   │        │ FK: project_id    │
                   │    ...        │        │    unit_number    │
                   └───────────────┘        │    floor_area     │
                                            │    price          │
                                            │    status         │
                                            └───────────────────┘

                   ┌────────────────────────────────────────────┐
                   │          site_tour_appointments            │
                   │────────────────────────────────────────────│
                   │ PK: id                                     │
                   │ FK: realty_id (optional)                   │
                   │    project_location                        │
                   │    seller_* (agent info)                   │
                   │    client_* (client info)                  │
                   │    schedule_date                           │
                   │    schedule_time                           │
                   │    status                                  │
                   └────────────────────────────────────────────┘
```

### Relationship Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| users → re_agents | 1:1 | Each agent has one user account |
| re_realties → re_agents | 1:N | A realty has many agents |
| re_realty_managers → re_agents | 1:N | A manager oversees many agents |
| re_agents ↔ re_buyers | M:N | Agents serve multiple buyers (via re_agent_buyers) |
| re_agents → re_sales | 1:N | An agent has many sales |
| re_buyers → re_sales | 1:N | A buyer can have multiple sales |
| re_agents → agent_incentives | 1:N | An agent has many incentives |
| re_sales → agent_incentives | 1:1 | Each sale generates one incentive |
| projects → vertical_project_units | 1:N | A project has many units |

---

## 3. Core Tables

### 3.1 re_agents

The central table for agent information.

```sql
CREATE TABLE re_agents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    realty_id BIGINT UNSIGNED NULL,
    realty_manager_id BIGINT UNSIGNED NULL,

    -- Referral & Appointment Codes
    referral_code VARCHAR(255) NULL,
    appointment_ref_code VARCHAR(255) NULL,

    -- Personal Information
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255) NULL,
    gender VARCHAR(255) NULL,
    contact_number VARCHAR(255) NULL,
    home_address VARCHAR(255) NULL,
    is_institution TINYINT(1) NULL DEFAULT 0,

    -- Government IDs
    pag_ibig_id BIGINT NULL,
    tin BIGINT NULL,

    -- Address Details
    agent_country VARCHAR(100) NULL,
    agent_region VARCHAR(100) NULL,
    agent_province VARCHAR(100) NULL,
    agent_city_mul VARCHAR(100) NULL,
    agent_brgy VARCHAR(100) NULL,
    agent_unit VARCHAR(100) NULL,
    building_name VARCHAR(150) NULL,
    house_no VARCHAR(20) NULL,
    agent_street VARCHAR(50) NULL,
    agent_subdivision VARCHAR(100) NULL,
    agent_zip_code VARCHAR(10) NULL,
    agent_landline VARCHAR(20) NULL,
    agent_phone_num VARCHAR(20) NULL,

    -- Timestamps
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,

    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (realty_id) REFERENCES re_realties(id),
    FOREIGN KEY (realty_manager_id) REFERENCES re_realty_managers(id),

    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_realty_id (realty_id),
    INDEX idx_referral_code (referral_code),
    INDEX idx_appointment_ref_code (appointment_ref_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.2 re_buyers

Client/buyer information table.

```sql
CREATE TABLE re_buyers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,

    -- Buyer Type
    buyer_type VARCHAR(255) NOT NULL, -- 'principal-buyer' or 'co-buyer'

    -- Personal Information
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255) NULL,
    contact_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NULL,
    birthdate DATE NULL,
    civil_status VARCHAR(255) NULL,
    nationality VARCHAR(255) NULL,

    -- Address
    buyer_country VARCHAR(100) NULL,
    buyer_region VARCHAR(100) NULL,
    buyer_province VARCHAR(100) NULL,
    buyer_city_mul VARCHAR(100) NULL,
    buyer_brgy VARCHAR(100) NULL,
    buyer_unit VARCHAR(100) NULL,
    buyer_building_name VARCHAR(150) NULL,
    buyer_house_no VARCHAR(20) NULL,
    buyer_street VARCHAR(50) NULL,
    buyer_subdivision VARCHAR(100) NULL,
    buyer_zip_code VARCHAR(10) NULL,

    -- Employment Information
    employment_type VARCHAR(255) NULL,
    company_name VARCHAR(255) NULL,
    company_address VARCHAR(255) NULL,
    position VARCHAR(255) NULL,
    monthly_income DECIMAL(15,2) NULL,
    years_employed INT NULL,

    -- Spouse Information
    spouse_first_name VARCHAR(255) NULL,
    spouse_last_name VARCHAR(255) NULL,
    spouse_middle_name VARCHAR(255) NULL,
    spouse_contact_number VARCHAR(255) NULL,
    spouse_occupation VARCHAR(255) NULL,

    -- Co-Borrower Information
    cb_first_name VARCHAR(255) NULL,
    cb_last_name VARCHAR(255) NULL,
    cb_relationship VARCHAR(255) NULL,
    cb_contact_number VARCHAR(255) NULL,

    -- SPA (Special Power of Attorney)
    spa_first_name VARCHAR(255) NULL,
    spa_last_name VARCHAR(255) NULL,
    spa_relationship VARCHAR(255) NULL,

    -- Pag-IBIG Information
    pag_ibig_number VARCHAR(255) NULL,
    pag_ibig_contribution_date DATE NULL,

    -- E-Signature
    e_signature TEXT NULL,

    -- Timestamps
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,

    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_contact_number (contact_number),
    INDEX idx_buyer_type (buyer_type),
    INDEX idx_name (last_name, first_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.3 re_agent_buyers

Junction table for agent-buyer relationships.

```sql
CREATE TABLE re_agent_buyers (
    agent_id BIGINT UNSIGNED NOT NULL,
    buyer_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,

    PRIMARY KEY (agent_id, buyer_id),
    FOREIGN KEY (agent_id) REFERENCES re_agents(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES re_buyers(id) ON DELETE CASCADE,

    INDEX idx_agent_id (agent_id),
    INDEX idx_buyer_id (buyer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.4 re_sales

Sales transaction table.

```sql
CREATE TABLE re_sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    buyer_id BIGINT UNSIGNED NOT NULL,
    agent_id BIGINT UNSIGNED NULL,
    project_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    prepared_by_user_id BIGINT UNSIGNED NULL,

    -- Pricing
    total_contract_price DOUBLE NOT NULL,
    total_contract_price_vat DOUBLE NULL,
    promo_code VARCHAR(255) NULL,
    discount DOUBLE NULL DEFAULT 0,

    -- Down Payment
    down_payment DOUBLE NULL,
    down_payment_net VARCHAR(255) NULL,

    -- Payment Tracking
    total_paid DOUBLE NULL DEFAULT 0,
    balance DOUBLE NULL,

    -- Equity
    has_equity INT NULL DEFAULT 0,
    equity_terms INT NULL, -- months
    monthly_equity_start_date DATE NULL,
    monthly_equity_end_date DATE NULL,
    monthly_equity DOUBLE NULL,

    -- Deferred Payment
    is_deferred INT NULL DEFAULT 0,
    deferred_amount DOUBLE NULL,
    deferred_months INT NULL,

    -- Reservation
    reservation_date DATETIME NOT NULL,
    reservation_fee DOUBLE NULL,

    -- Financing
    financing VARCHAR(255) NULL, -- 'cash', 'bank_loan', 'pag_ibig', 'in_house'

    -- Status
    status VARCHAR(255) NOT NULL DEFAULT 'PENDING',
    cancel_reason VARCHAR(255) NULL,
    remarks TEXT NULL,

    -- Timestamps
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    -- Foreign Keys
    FOREIGN KEY (buyer_id) REFERENCES re_buyers(id),
    FOREIGN KEY (agent_id) REFERENCES re_agents(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (unit_id) REFERENCES vertical_project_units(id),

    -- Indexes
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_agent_id (agent_id),
    INDEX idx_project_id (project_id),
    INDEX idx_unit_id (unit_id),
    INDEX idx_status (status),
    INDEX idx_reservation_date (reservation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.5 agent_incentives

Agent incentive/commission tracking.

```sql
CREATE TABLE agent_incentives (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agent_id BIGINT UNSIGNED NOT NULL,
    sale_id BIGINT UNSIGNED NOT NULL,
    unit_id BIGINT UNSIGNED NOT NULL,
    approved_by_user_id BIGINT UNSIGNED NULL,
    requested_by_user_id BIGINT UNSIGNED NULL,

    -- Incentive Amount
    total_incentive DECIMAL(15,2) NOT NULL,

    -- Status
    status VARCHAR(255) NOT NULL DEFAULT 'pending',
    -- Values: 'pending', 'approved', 'rejected', 'paid'

    -- Dates
    date_needed DATE NULL,
    approved_at TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,

    -- Attachments & Notes
    rfp_attachment VARCHAR(255) NULL,
    remarks TEXT NULL,
    rejection_reason TEXT NULL,

    -- Timestamps
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    -- Foreign Keys
    FOREIGN KEY (agent_id) REFERENCES re_agents(id),
    FOREIGN KEY (sale_id) REFERENCES re_sales(id),
    FOREIGN KEY (unit_id) REFERENCES vertical_project_units(id),

    -- Indexes
    INDEX idx_agent_id (agent_id),
    INDEX idx_sale_id (sale_id),
    INDEX idx_status (status),
    INDEX idx_date_needed (date_needed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.6 agent_incentive_items

Individual incentive line items.

```sql
CREATE TABLE agent_incentive_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agent_incentive_id BIGINT UNSIGNED NOT NULL,

    -- Incentive Type
    incentive_type VARCHAR(255) NOT NULL,
    -- Values: 'commission', 'bonus', 'override', 'referral', 'other'

    -- Amount
    amount DECIMAL(15,2) NOT NULL,
    description VARCHAR(255) NULL,

    -- Timestamps
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    -- Foreign Key
    FOREIGN KEY (agent_incentive_id) REFERENCES agent_incentives(id) ON DELETE CASCADE,

    -- Index
    INDEX idx_incentive_id (agent_incentive_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.7 re_realties

Realty company information.

```sql
CREATE TABLE re_realties (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(255) NULL,
    detail TEXT NULL,

    -- Timestamps
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    -- Index
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.8 re_realty_managers

Management hierarchy within realties.

```sql
CREATE TABLE re_realty_managers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    realty_id BIGINT UNSIGNED NOT NULL,
    agent_id BIGINT UNSIGNED NOT NULL,

    -- Role
    role VARCHAR(255) NULL,
    -- Values: 'Unit Manager', 'Team Leader', 'Broker'

    -- Timestamps
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,

    -- Foreign Keys
    FOREIGN KEY (realty_id) REFERENCES re_realties(id),
    FOREIGN KEY (agent_id) REFERENCES re_agents(id),

    -- Indexes
    INDEX idx_realty_id (realty_id),
    INDEX idx_agent_id (agent_id),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.9 site_tour_appointments

Site tour appointment scheduling.

```sql
CREATE TABLE site_tour_appointments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    -- Location
    project_location VARCHAR(255) NOT NULL,
    realty_id BIGINT UNSIGNED NULL,
    non_realty VARCHAR(255) NULL, -- For non-affiliated agents

    -- Seller/Agent Information
    seller_name VARCHAR(255) NOT NULL,
    seller_contact_number VARCHAR(255) NOT NULL,
    seller_email VARCHAR(255) NULL,

    -- Client Information
    client_name VARCHAR(255) NOT NULL,
    client_contact_number VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NULL,
    client_address VARCHAR(255) NULL,

    -- Schedule
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,

    -- Transportation
    transportation_type VARCHAR(255) NULL,
    -- Values: 'shuttle', 'self', 'pickup'
    pickup_location VARCHAR(255) NULL,
    pickup_time TIME NULL,

    -- Pre-Approval
    pre_approval_status VARCHAR(255) NULL,
    pre_approval_monthly_amort DECIMAL(15,2) NULL,

    -- Status
    status VARCHAR(255) NOT NULL DEFAULT 'scheduled',
    -- Values: 'scheduled', 'completed', 'cancelled', 'no_show'
    reason_for_not_attending TEXT NULL,
    notes TEXT NULL,

    -- Timestamps
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    -- Foreign Key
    FOREIGN KEY (realty_id) REFERENCES re_realties(id),

    -- Indexes
    INDEX idx_realty_id (realty_id),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_status (status),
    INDEX idx_seller_contact (seller_contact_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. Table Relationships

### 4.1 Agent-Centric Relationships

```
users (1) ──────────────────────► (1) re_agents
                                      │
                                      ├──► (N) re_sales
                                      │
                                      ├──► (N) agent_incentives
                                      │
                                      ├──► (N) re_agent_buyers ──► (N) re_buyers
                                      │
                                      └──► (1) re_realty_managers
                                                    │
                                                    └──► (1) re_realties
```

### 4.2 Sales-Centric Relationships

```
re_sales
    │
    ├──► (1) re_agents        [agent_id]
    │
    ├──► (1) re_buyers        [buyer_id]
    │
    ├──► (1) projects         [project_id]
    │
    ├──► (1) vertical_project_units  [unit_id]
    │
    └──► (1) agent_incentives [sale_id - reverse]
               │
               └──► (N) agent_incentive_items
```

### 4.3 Organization Hierarchy

```
re_realties
    │
    ├──► (N) re_realty_managers
    │         │
    │         └──► (1) re_agents (as manager)
    │
    └──► (N) re_agents [realty_id]
              │
              └──► (1) re_realty_managers [realty_manager_id]
```

---

## 5. Index Strategy

### 5.1 Primary Indexes

All tables have auto-increment primary keys for efficient joins and lookups.

### 5.2 Foreign Key Indexes

Foreign key columns are indexed for join performance:

| Table | Index | Columns |
|-------|-------|---------|
| re_agents | idx_user_id | user_id |
| re_agents | idx_realty_id | realty_id |
| re_agent_buyers | idx_agent_id | agent_id |
| re_agent_buyers | idx_buyer_id | buyer_id |
| re_sales | idx_agent_id | agent_id |
| re_sales | idx_buyer_id | buyer_id |
| agent_incentives | idx_agent_id | agent_id |
| agent_incentives | idx_sale_id | sale_id |

### 5.3 Search Indexes

For common search operations:

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| re_agents | idx_referral_code | referral_code | Referral link lookup |
| re_agents | idx_appointment_ref_code | appointment_ref_code | Appointment link lookup |
| re_buyers | idx_email | email | Email search |
| re_buyers | idx_name | last_name, first_name | Name search |
| re_sales | idx_status | status | Status filtering |
| re_sales | idx_reservation_date | reservation_date | Date range queries |

### 5.4 Composite Indexes

For complex queries:

```sql
-- For client list with pagination
CREATE INDEX idx_agent_buyers_created
ON re_agent_buyers (agent_id, created_at DESC);

-- For sales filtering
CREATE INDEX idx_sales_agent_status_date
ON re_sales (agent_id, status, reservation_date DESC);

-- For incentive filtering
CREATE INDEX idx_incentives_agent_status
ON agent_incentives (agent_id, status, created_at DESC);

-- For appointment filtering
CREATE INDEX idx_appointments_date_status
ON site_tour_appointments (scheduled_date, status);
```

### 5.5 Query Performance Recommendations

1. **Client List Query** (Most frequent):
   ```sql
   -- Use covering index for basic list
   SELECT b.id, b.first_name, b.last_name, b.email, b.contact_number
   FROM re_buyers b
   INNER JOIN re_agent_buyers ab ON b.id = ab.buyer_id
   WHERE ab.agent_id = ?
   ORDER BY ab.created_at DESC
   LIMIT ? OFFSET ?;
   ```

2. **Dashboard Statistics**:
   ```sql
   -- Pre-aggregate in application or use materialized views
   -- Consider caching with Redis (5-minute TTL)
   ```

3. **Search Operations**:
   ```sql
   -- Use FULLTEXT index for name/email search if needed
   ALTER TABLE re_buyers
   ADD FULLTEXT INDEX ft_buyer_search (first_name, last_name, email);
   ```

---

## 6. Data Dictionary

### 6.1 Status Values

#### Sale Status
| Value | Description |
|-------|-------------|
| `PENDING` | Sale created, awaiting approval |
| `APPROVED` | Sale approved by management |
| `CANCELLED` | Sale cancelled |
| `COMPLETED` | Sale fully completed |

#### Incentive Status
| Value | Description |
|-------|-------------|
| `pending` | Awaiting approval |
| `approved` | Approved for payment |
| `rejected` | Rejected with reason |
| `paid` | Payment processed |

#### Appointment Status
| Value | Description |
|-------|-------------|
| `scheduled` | Appointment confirmed |
| `completed` | Site tour completed |
| `cancelled` | Cancelled by agent/client |
| `no_show` | Client did not attend |

#### Buyer Type
| Value | Description |
|-------|-------------|
| `principal-buyer` | Primary purchaser |
| `co-buyer` | Joint purchaser |

#### Manager Role
| Value | Description |
|-------|-------------|
| `Unit Manager` | Manages a unit of agents |
| `Team Leader` | Leads a team |
| `Broker` | Licensed broker |

### 6.2 Financing Types

| Value | Description |
|-------|-------------|
| `cash` | Full cash payment |
| `bank_loan` | Bank financing |
| `pag_ibig` | Pag-IBIG housing loan |
| `in_house` | Developer financing |

### 6.3 Transportation Types

| Value | Description |
|-------|-------------|
| `shuttle` | Developer shuttle service |
| `self` | Own transportation |
| `pickup` | Agent pickup |

---

## Summary

This database schema documentation provides:

- Complete table definitions for all Agent Interface entities
- Clear relationship mappings between tables
- Comprehensive indexing strategy for optimal query performance
- Data dictionary for status values and enums

The schema leverages the existing `marrea-local` MySQL database structure while providing clear documentation for the Agent Interface application development.

For implementation details, refer to:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Domain model mapping
- [API_DESIGN.md](./API_DESIGN.md) - API to database mapping
