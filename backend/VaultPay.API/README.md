# VaultPay Backend API

A production-grade fintech backend for a digital wallet system built with ASP.NET Core 8 and EF Core 8.

## Features

- ✅ Secure JWT Authentication & Authorization
- ✅ User Management (Register, Login, Profile)
- ✅ Wallet System (Balance Management)
- ✅ P2P Money Transfer (Atomic Transactions)
- ✅ Razorpay Payment Integration (Test Mode)
- ✅ Bill Payments (Mobile, Electricity, DTH)
- ✅ Transaction History
- ✅ Global Exception Handling
- ✅ Swagger API Documentation

## Tech Stack

- **Framework**: ASP.NET Core 8 (LTS)
- **Database**: SQL Server with EF Core 8 (Code-First)
- **Authentication**: JWT with BCrypt Password Hashing
- **Payment**: Razorpay Integration
- **Architecture**: Controller → Service → Repository Pattern

## Project Structure

```
VaultPay.API/
├── Controllers/          # API endpoints
├── Services/             # Business logic layer
├── Repositories/         # Data access layer
├── Models/
│   ├── Entities/        # Database entities
│   └── DTOs/            # Data transfer objects
├── Data/                # Database context
├── Middleware/          # Global exception handling
├── Utilities/           # JWT & signature services
├── Configuration/       # Configuration helpers
└── Properties/          # Project settings
```

## Setup Instructions

### Prerequisites

- .NET 8 SDK
- SQL Server 2019 or later
- Visual Studio 2022 or VS Code

### Configuration

1. **Update Connection String** in `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=VaultPayDb;Trusted_Connection=true;TrustServerCertificate=true;"
}
```

2. **Update JWT Settings** in `appsettings.json`:

```json
"Jwt": {
  "Secret": "your_super_secret_key_at_least_32_characters_long",
  "Issuer": "VaultPayAPI",
  "Audience": "VaultPayClient",
  "ExpiryMinutes": 60
}
```

3. **Update Razorpay Credentials** in `appsettings.json`:

```json
"Razorpay": {
  "KeyId": "your_razorpay_key_id",
  "KeySecret": "your_razorpay_key_secret"
}
```

### Installation

```bash
cd VaultPay.API
dotnet restore
dotnet ef database update
dotnet run
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Wallets

- `GET /api/wallets` - Get wallet details (Protected)
- `GET /api/wallets/balance` - Get wallet balance (Protected)

### Transactions

- `POST /api/transactions/transfer` - Transfer money (Protected)
- `GET /api/transactions/history` - Get transaction history (Protected)

### Payments

- `POST /api/payments/razorpay/create-order` - Create Razorpay order (Protected)
- `POST /api/payments/razorpay/verify` - Verify payment & credit wallet (Protected)

### Bills

- `POST /api/bills/pay` - Pay bill (Protected)
- `GET /api/bills/history` - Get bill payment history (Protected)

## API Documentation

Swagger documentation is available at `https://localhost:7001/swagger` when running in development mode.

## Security Features

- ✅ JWT token-based authentication
- ✅ BCrypt password hashing
- ✅ Role-based authorization
- ✅ Razorpay signature verification
- ✅ CORS enabled for Next.js frontend
- ✅ Atomic database transactions
- ✅ Global exception handling

## Testing

Use Postman or Swagger UI to test the endpoints. Include the JWT token in the `Authorization: Bearer <token>` header for protected endpoints.

## Database Migrations

```bash
# Create a new migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Revert last migration
dotnet ef database update <PreviousMigrationName>
```

## Code Quality

- Clean architecture with separation of concerns
- No business logic in controllers
- Repository pattern for data access
- Service layer for business logic
- DTO validation and proper HTTP status codes
- Global exception handling middleware
- Comprehensive API documentation

## License

All rights reserved.
