# API Design Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Common Patterns](#3-common-patterns)
4. [API Endpoints](#4-api-endpoints)
5. [Error Handling](#5-error-handling)

---

## 1. Overview

### Base URL

```
Production:  https://api.agentinterface.example.com/v1
Development: http://localhost:8080/v1
```

### Content Type

All requests and responses use JSON:

```
Content-Type: application/json
Accept: application/json
```

### API Versioning

The API uses URL path versioning (`/v1/`). Breaking changes will result in a new version (`/v2/`).

---

## 2. Authentication

### Authentication Flow

```
1. Client sends credentials to POST /auth/login
2. Server validates and returns access_token + refresh_token
3. Client includes access_token in Authorization header for subsequent requests
4. When access_token expires, client uses refresh_token to get new tokens
5. Client calls POST /auth/logout to invalidate tokens
```

### Token Structure

| Token | Lifetime | Storage | Purpose |
|-------|----------|---------|---------|
| Access Token | 15 minutes | Memory/Cookie | API authentication |
| Refresh Token | 7 days | HttpOnly Cookie | Token renewal |

### Authorization Header

```
Authorization: Bearer <access_token>
```

### Authentication Endpoints

#### POST /auth/login

Authenticate an agent and receive JWT tokens.

**Request:**
```json
{
  "email": "agent@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": 123,
      "name": "Juan Dela Cruz",
      "email": "agent@example.com",
      "avatar_url": "https://storage.example.com/avatars/123.jpg"
    },
    "agent": {
      "id": 456,
      "referral_code": "ABC123",
      "roles": ["agent", "team_leader"]
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect"
  }
}
```

---

#### POST /auth/refresh

Refresh the access token using a valid refresh token.

**Request:**
```json
{
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response (200 OK):**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "bmV3IHJlZnJlc2ggdG9rZW4...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

---

#### POST /auth/logout

Invalidate the current session and tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (204 No Content):**
No body returned.

---

## 3. Common Patterns

### Response Envelope

All successful responses follow this structure:

```json
{
  "data": { ... },
  "meta": { ... }
}
```

### Pagination

List endpoints support pagination with these query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `per_page` | integer | 20 | Items per page (max: 100) |

**Paginated Response:**
```json
{
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### Filtering

List endpoints support filtering via query parameters:

```
GET /clients?search=john&buyer_type=principal-buyer&created_from=2024-01-01
```

### Sorting

List endpoints support sorting:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sort_by` | string | `created_at` | Field to sort by |
| `sort_order` | string | `desc` | Sort direction (`asc` or `desc`) |

```
GET /clients?sort_by=last_name&sort_order=asc
```

### Date Formats

All dates use ISO 8601 format:

```
Date: 2024-01-15
DateTime: 2024-01-15T10:30:00Z
```

---

## 4. API Endpoints

### Agent Endpoints

#### GET /agents/me

Get the authenticated agent's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 456,
    "user_id": 123,
    "referral_code": "ABC123",
    "appointment_ref_code": "XYZ789",
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "middle_name": "Santos",
    "gender": "male",
    "contact_number": "+639171234567",
    "email": "agent@example.com",
    "address": {
      "country": "Philippines",
      "region": "NCR",
      "province": "Metro Manila",
      "city": "Makati City",
      "barangay": "Poblacion",
      "street": "Ayala Avenue",
      "unit": "Unit 1201",
      "building_name": "Tower One",
      "house_no": "123",
      "subdivision": null,
      "zip_code": "1226"
    },
    "realty": {
      "id": 1,
      "name": "ABC Realty Corporation"
    },
    "manager": {
      "id": 10,
      "name": "Maria Santos",
      "role": "team_leader"
    },
    "roles": ["agent", "team_leader"],
    "is_broker": false,
    "pag_ibig_id": "123456789012",
    "tin": "123456789",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-03-20T14:45:00Z"
  }
}
```

---

#### PUT /agents/me

Update the authenticated agent's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "contact_number": "+639181234567",
  "address": {
    "street": "New Street Name",
    "unit": "Unit 1501"
  }
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 456,
    "message": "Profile updated successfully"
  }
}
```

---

#### GET /agents/me/referral-link

Get the agent's referral link for sharing.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "referral_code": "ABC123",
    "referral_link": "https://www.example.com/register?ref=ABC123",
    "usage_count": 15,
    "successful_referrals": 8
  }
}
```

---

#### GET /agents/me/appointment-link

Get the agent's site tour appointment booking link.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "appointment_ref_code": "XYZ789",
    "appointment_link": "https://www.example.com/book-tour?agent=XYZ789",
    "total_appointments": 25,
    "pending_appointments": 3
  }
}
```

---

#### GET /agents/me/dashboard

Get the agent's dashboard statistics.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "total_clients": 45,
    "new_clients_this_month": 5,
    "total_sales": 12,
    "pending_sales": 3,
    "completed_sales": 9,
    "total_incentives": 250000.00,
    "pending_incentives": 50000.00,
    "paid_incentives": 200000.00,
    "upcoming_appointments": 4,
    "monthly_summary": [
      {
        "month": "2024-01",
        "sales_count": 2,
        "sales_amount": 5000000.00,
        "incentive_amount": 50000.00
      },
      {
        "month": "2024-02",
        "sales_count": 3,
        "sales_amount": 7500000.00,
        "incentive_amount": 75000.00
      }
    ]
  }
}
```

---

### Client Endpoints

#### GET /clients

List the agent's clients with pagination and filtering.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `per_page` | integer | Items per page |
| `search` | string | Search by name, email, or contact |
| `buyer_type` | string | Filter by type: `principal-buyer`, `co-buyer` |
| `sort_by` | string | Sort field: `name`, `created_at`, `email` |
| `sort_order` | string | `asc` or `desc` |

**Example:**
```
GET /clients?page=1&per_page=20&search=juan&sort_by=created_at&sort_order=desc
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 101,
      "full_name": "Juan Santos",
      "first_name": "Juan",
      "last_name": "Santos",
      "email": "juan.santos@email.com",
      "contact_number": "+639171234567",
      "buyer_type": "principal-buyer",
      "sales_count": 2,
      "latest_sale_status": "approved",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 102,
      "full_name": "Maria Garcia",
      "first_name": "Maria",
      "last_name": "Garcia",
      "email": "maria.garcia@email.com",
      "contact_number": "+639181234567",
      "buyer_type": "principal-buyer",
      "sales_count": 1,
      "latest_sale_status": "pending",
      "created_at": "2024-02-20T14:45:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 45,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

---

#### POST /clients

Add a new client.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "buyer_type": "principal-buyer",
  "first_name": "Pedro",
  "last_name": "Reyes",
  "middle_name": "Cruz",
  "email": "pedro.reyes@email.com",
  "contact_number": "+639191234567",
  "gender": "male",
  "birthdate": "1985-06-15",
  "civil_status": "married",
  "address": {
    "region": "NCR",
    "province": "Metro Manila",
    "city": "Quezon City",
    "barangay": "Diliman",
    "street": "Katipunan Avenue",
    "zip_code": "1100"
  }
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 103,
    "full_name": "Pedro Reyes",
    "email": "pedro.reyes@email.com",
    "message": "Client created successfully"
  }
}
```

---

#### GET /clients/{id}

Get detailed information about a specific client.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 101,
    "user_id": null,
    "buyer_type": "principal-buyer",
    "first_name": "Juan",
    "last_name": "Santos",
    "middle_name": "Dela Cruz",
    "email": "juan.santos@email.com",
    "contact_number": "+639171234567",
    "gender": "male",
    "birthdate": "1980-05-20",
    "civil_status": "married",
    "nationality": "Filipino",
    "address": {
      "region": "NCR",
      "province": "Metro Manila",
      "city": "Makati City",
      "barangay": "San Antonio",
      "street": "Jupiter Street",
      "unit": "Unit 501",
      "building_name": "Jupiter Tower",
      "zip_code": "1209"
    },
    "employment": {
      "type": "employed",
      "company_name": "ABC Corporation",
      "position": "Manager",
      "monthly_income": 80000.00,
      "years_employed": 5
    },
    "spouse": {
      "first_name": "Maria",
      "last_name": "Santos",
      "contact_number": "+639181234567",
      "occupation": "Teacher"
    },
    "sales": [
      {
        "id": 201,
        "project_name": "Green Residences",
        "unit_number": "T1-1201",
        "status": "approved",
        "reservation_date": "2024-01-10"
      }
    ],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-03-20T14:45:00Z"
  }
}
```

---

#### PUT /clients/{id}

Update client information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "contact_number": "+639191234567",
  "employment": {
    "company_name": "XYZ Corporation",
    "position": "Senior Manager",
    "monthly_income": 100000.00
  }
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 101,
    "message": "Client updated successfully"
  }
}
```

---

#### GET /clients/export

Export the agent's client list as CSV or XLSX.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `format` | string | Export format: `csv` (default) or `xlsx` |
| `search` | string | Filter by search term |
| `buyer_type` | string | Filter by buyer type |

**Response (200 OK):**

For CSV format:
```
Content-Type: text/csv
Content-Disposition: attachment; filename="clients_20240315.csv"
```

For XLSX format:
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="clients_20240315.xlsx"
```

---

### Sales Endpoints

#### GET /sales

List the agent's sales transactions.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `per_page` | integer | Items per page |
| `status` | string | Filter: `pending`, `approved`, `cancelled`, `completed` |
| `date_from` | date | Filter by reservation date (from) |
| `date_to` | date | Filter by reservation date (to) |
| `project_id` | integer | Filter by project |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 201,
      "buyer": {
        "id": 101,
        "full_name": "Juan Santos"
      },
      "project": {
        "id": 1,
        "name": "Green Residences"
      },
      "unit": {
        "id": 501,
        "unit_number": "T1-1201",
        "floor_area": 45.5,
        "unit_type": "1BR"
      },
      "total_contract_price": 3500000.00,
      "reservation_date": "2024-01-10",
      "status": "approved",
      "financing": "bank_loan",
      "created_at": "2024-01-10T14:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 12,
    "total_pages": 1
  }
}
```

---

#### GET /sales/{id}

Get detailed information about a specific sale.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 201,
    "buyer": {
      "id": 101,
      "full_name": "Juan Santos",
      "email": "juan.santos@email.com",
      "contact_number": "+639171234567"
    },
    "project": {
      "id": 1,
      "name": "Green Residences",
      "location": "Makati City"
    },
    "unit": {
      "id": 501,
      "unit_number": "T1-1201",
      "floor": 12,
      "floor_area": 45.5,
      "unit_type": "1BR"
    },
    "pricing": {
      "total_contract_price": 3500000.00,
      "total_contract_price_vat": 3920000.00,
      "discount": 100000.00,
      "reservation_fee": 20000.00,
      "down_payment_percentage": 20,
      "down_payment_amount": 700000.00,
      "total_paid": 250000.00,
      "balance": 3270000.00
    },
    "equity": {
      "has_equity": true,
      "equity_net": 600000.00,
      "equity_terms": 24,
      "monthly_equity": 25000.00,
      "start_date": "2024-02-01",
      "end_date": "2026-01-01"
    },
    "reservation": {
      "date": "2024-01-10",
      "fee": 20000.00,
      "promo_code": "NEWYEAR2024"
    },
    "financing": "bank_loan",
    "status": "approved",
    "remarks": null,
    "created_at": "2024-01-10T14:30:00Z",
    "updated_at": "2024-01-15T09:00:00Z"
  }
}
```

---

#### GET /sales/{id}/payments

Get payment history for a specific sale.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "sale_id": 201,
    "total_paid": 250000.00,
    "balance": 3270000.00,
    "payments": [
      {
        "id": 1,
        "type": "reservation",
        "amount": 20000.00,
        "payment_method": "check",
        "check_number": "CHK-001",
        "check_date": "2024-01-10",
        "bank": "BDO",
        "status": "cleared",
        "payment_date": "2024-01-10"
      },
      {
        "id": 2,
        "type": "equity",
        "amount": 25000.00,
        "payment_method": "bank_transfer",
        "reference_number": "TXN-12345",
        "status": "confirmed",
        "payment_date": "2024-02-01"
      }
    ]
  }
}
```

---

### Incentive Endpoints

#### GET /incentives

List the agent's incentives.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `per_page` | integer | Items per page |
| `status` | string | Filter: `pending`, `approved`, `rejected`, `paid` |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 301,
      "sale": {
        "id": 201,
        "buyer_name": "Juan Santos",
        "unit_number": "T1-1201"
      },
      "total_incentive": 35000.00,
      "status": "approved",
      "approved_by": "Maria Santos",
      "approved_at": "2024-02-01T10:00:00Z",
      "date_needed": "2024-02-15",
      "created_at": "2024-01-15T14:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 8,
    "total_pages": 1
  }
}
```

---

#### GET /incentives/{id}

Get detailed information about a specific incentive.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 301,
    "agent": {
      "id": 456,
      "full_name": "Juan Dela Cruz"
    },
    "sale": {
      "id": 201,
      "buyer_name": "Juan Santos",
      "project_name": "Green Residences",
      "unit_number": "T1-1201",
      "total_contract_price": 3500000.00
    },
    "total_incentive": 35000.00,
    "items": [
      {
        "id": 1,
        "type": "commission",
        "description": "Sales Commission (1%)",
        "amount": 35000.00
      }
    ],
    "status": "approved",
    "requested_by": {
      "id": 456,
      "name": "Juan Dela Cruz"
    },
    "approved_by": {
      "id": 10,
      "name": "Maria Santos"
    },
    "date_needed": "2024-02-15",
    "rfp_attachment": "https://storage.example.com/rfp/301.pdf",
    "remarks": "For February payout",
    "rejection_reason": null,
    "requested_at": "2024-01-15T14:30:00Z",
    "approved_at": "2024-02-01T10:00:00Z",
    "paid_at": null
  }
}
```

---

### Appointment Endpoints

#### GET /appointments

List the agent's site tour appointments.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `per_page` | integer | Items per page |
| `status` | string | Filter: `scheduled`, `completed`, `cancelled`, `no_show` |
| `date_from` | date | Filter by appointment date (from) |
| `date_to` | date | Filter by appointment date (to) |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 401,
      "client": {
        "name": "Pedro Reyes",
        "contact_number": "+639191234567",
        "email": "pedro.reyes@email.com"
      },
      "project_location": "Green Residences, Makati",
      "scheduled_date": "2024-03-20",
      "scheduled_time": "10:00",
      "status": "scheduled",
      "transportation": "shuttle",
      "created_at": "2024-03-15T09:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 4,
    "total_pages": 1
  }
}
```

---

#### POST /appointments

Schedule a new site tour appointment.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "project_location": "Green Residences, Makati",
  "client": {
    "name": "Ana Cruz",
    "contact_number": "+639201234567",
    "email": "ana.cruz@email.com"
  },
  "scheduled_date": "2024-03-25",
  "scheduled_time": "14:00",
  "transportation": "self",
  "notes": "Client is interested in 2BR units",
  "pre_approval": {
    "status": "approved",
    "monthly_amortization": 25000.00
  }
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 402,
    "message": "Appointment scheduled successfully",
    "scheduled_date": "2024-03-25",
    "scheduled_time": "14:00"
  }
}
```

---

#### GET /appointments/{id}

Get detailed information about a specific appointment.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 401,
    "agent": {
      "id": 456,
      "full_name": "Juan Dela Cruz",
      "contact_number": "+639171234567"
    },
    "realty": {
      "id": 1,
      "name": "ABC Realty Corporation"
    },
    "client": {
      "name": "Pedro Reyes",
      "contact_number": "+639191234567",
      "email": "pedro.reyes@email.com",
      "address": "Quezon City"
    },
    "project_location": "Green Residences, Makati",
    "schedule": {
      "date": "2024-03-20",
      "time": "10:00",
      "duration_hours": 2
    },
    "transportation": {
      "type": "shuttle",
      "pickup_location": "Quezon City",
      "pickup_time": "08:00"
    },
    "pre_approval": {
      "status": "pending",
      "monthly_amortization": null
    },
    "status": "scheduled",
    "notes": "Client interested in 1BR and 2BR units",
    "reason_for_not_attending": null,
    "created_at": "2024-03-15T09:00:00Z",
    "updated_at": "2024-03-15T09:00:00Z"
  }
}
```

---

#### PATCH /appointments/{id}

Update appointment status.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "status": "completed",
  "notes": "Client reserved T1-0501"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 401,
    "status": "completed",
    "message": "Appointment updated successfully"
  }
}
```

---

### Property Endpoints

#### GET /projects

List available projects.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Green Residences",
      "location": "Makati City",
      "type": "condominium",
      "status": "selling",
      "total_units": 500,
      "available_units": 150,
      "price_range": {
        "min": 2500000.00,
        "max": 8000000.00
      },
      "image_url": "https://storage.example.com/projects/1/main.jpg"
    }
  ]
}
```

---

#### GET /projects/{id}/units

List available units in a project.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter: `available`, `reserved`, `sold` |
| `unit_type` | string | Filter: `studio`, `1BR`, `2BR`, `3BR` |
| `floor_from` | integer | Minimum floor |
| `floor_to` | integer | Maximum floor |
| `price_from` | number | Minimum price |
| `price_to` | number | Maximum price |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 501,
      "unit_number": "T1-1201",
      "tower": "Tower 1",
      "floor": 12,
      "unit_type": "1BR",
      "floor_area": 45.5,
      "balcony_area": 5.0,
      "total_area": 50.5,
      "price": 3500000.00,
      "price_per_sqm": 76923.08,
      "status": "available",
      "view": "City View"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

## 5. Error Handling

### Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### HTTP Status Codes

| Status | Description | Use Case |
|--------|-------------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE or action with no response body |
| 400 | Bad Request | Invalid request body or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `TOKEN_EXPIRED` | 401 | Access token has expired |
| `TOKEN_INVALID` | 401 | Token is malformed or tampered |
| `FORBIDDEN` | 403 | User lacks permission |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource doesn't exist |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Validation Error Example

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "fields": [
        {
          "field": "email",
          "message": "Email is required"
        },
        {
          "field": "contact_number",
          "message": "Invalid phone number format"
        }
      ]
    }
  }
}
```

### Rate Limit Error Example

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retry_after": 60,
      "limit": 100,
      "remaining": 0,
      "reset_at": "2024-03-20T10:31:00Z"
    }
  }
}
```

---

## Summary

This API documentation provides a complete reference for integrating with the Agent Interface backend. Key points:

- **Authentication**: JWT-based with access and refresh tokens
- **Pagination**: Consistent across all list endpoints
- **Filtering**: Query parameters for filtering and sorting
- **Error Handling**: Standardized error response format
- **Security**: All endpoints require authentication except login

For visual diagrams and architecture details, refer to:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [SECURITY.md](./SECURITY.md) - Security implementation
