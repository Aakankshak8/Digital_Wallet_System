# VaultPay – Backend Implementation Plan (.NET 8)

## Objective

Build a production-grade fintech backend for a digital wallet system with secure authentication, atomic transactions, Razorpay test payments, and bill payments using ASP.NET Core 8 and EF Core 8 (Code-First).

No shortcuts. No demo-quality code.

---

## Phase 0 – Project Setup

- Create ASP.NET Core Web API (.NET 8 – LTS)
- Configure Swagger
- Setup SQL Server connection
- Add EF Core 8 packages
- Configure BCrypt
- Setup JWT authentication
- Enable CORS for Next.js frontend
- Add Global Exception Middleware

Verification:

- API starts without errors
- Swagger loads
- Database connection successful

---

## Phase 1 – Database & Entities (Code-First)

### Entities

- User
- Wallet (1:1 with User)
- Transaction
- RazorpayOrder
- BillPayment

### Rules

- No manual SQL
- Use EF Core migrations only
- Proper relationships & constraints
- Unique Email & Phone

Verification:

- Migration created
- Database tables auto-generated
- Relationships verified

---

## Phase 2 – Authentication Module

### Features

- Register
- Login
- JWT generation
- BCrypt password hashing
- Wallet auto-creation on signup

### Rules

- No plain passwords
- JWT expiry mandatory
- Role-based support (User/Admin)

Verification:

- Register creates User + Wallet
- Login returns JWT
- Protected API blocks unauthorized access

---

## Phase 3 – User Module

### Features

- Fetch profile
- Update profile
- Token-based access only

Verification:

- User can access own profile only
- No data leakage

---

## Phase 4 – Wallet Module

### Features

- Get wallet balance
- Prevent negative balance
- One wallet per user

Verification:

- Balance accurate
- Negative balance blocked

---

## Phase 5 – Transaction Module (CRITICAL)

### Features

- Peer-to-peer transfer
- Atomic DB transactions
- Rollback on failure
- Sender & receiver wallet update
- Full transaction logging

### Rules

- Use EF Core transaction scopes
- No partial updates allowed

Verification:

- Failure rolls back all changes
- Balances always consistent

---

## Phase 6 – Razorpay Payment Module

### Features

- Create Razorpay order
- Verify Razorpay signature
- Credit wallet only after verification

### Rules

- Test mode only
- No hardcoded keys
- Signature verification mandatory

Verification:

- Wallet updates only after valid payment
- Invalid signature rejected

---

## Phase 7 – Bill Payment Module

### Features

- Mobile / Electricity / DTH payments
- Wallet deduction
- Bill payment record
- Transaction entry

Verification:

- Wallet deducted correctly
- Bill payment logged
- Transaction history updated

---

## Phase 8 – Security & Validation

### Mandatory

- DTO validation
- Proper HTTP status codes
- Authorize attributes
- Global exception handling
- No business logic in controllers

Verification:

- Invalid requests rejected
- Errors returned in standard format

---

## Final Checklist

- Controller → Service → Repository pattern followed
- No fat controllers
- No raw SQL
- EF Core only
- Clean folder structure
- Swagger documentation complete
- Ready for frontend integration
