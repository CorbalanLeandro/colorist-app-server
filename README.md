# Colorist App Server

This API manages Colorist users and their clients, keeping a record of hair services performed on each client.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Testing**: [Jest](https://jestjs.io/) (unit and e2e tests - in progress)

---

## Entities

### Colorist

The main entity represents the app users. Username and email must be unique and are immutable.

### Client

These are the Colorist's clients. Each client has the colorist's `id` to identify which colorist it belongs to.

### Sheet

The Sheet entity is the hair services container for a specific date. Each sheet belongs to one client and contains an array of hair services performed that day.

### Hair Service

Contains the client's service information (type, technique, products used, etc.). It's embedded within the Sheet document.

### Hair Service Ingredient

Represents the individual ingredients or products used in a hair service. Each hair service can have multiple ingredients, tracking the specific products applied during the service.

---

## Authentication

The server uses JWT authentication with a 14-day token expiration.

### Public Endpoints

- `POST /api/colorist` - Create a new colorist
- `POST /api/auth/sign-in` - Sign in and obtain access token

### Protected Endpoints

All other endpoints require the JWT token in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

---

## API Endpoints

### Colorist

| Method | Endpoint                        | Description                             |
| ------ | ------------------------------- | --------------------------------------- |
| POST   | `/api/colorist`                 | Create a new colorist (public)          |
| GET    | `/api/colorist`                 | Get current colorist info               |
| PATCH  | `/api/colorist`                 | Update colorist profile                 |
| PATCH  | `/api/colorist/change-password` | Change password (requires old password) |
| DELETE | `/api/colorist`                 | Delete colorist and all associated data |

### Auth

| Method | Endpoint            | Description                                       |
| ------ | ------------------- | ------------------------------------------------- |
| POST   | `/api/auth/sign-in` | Sign in with email/username and password (public) |

### Client

| Method | Endpoint                | Description                                            |
| ------ | ----------------------- | ------------------------------------------------------ |
| POST   | `/api/client`           | Create a new client                                    |
| GET    | `/api/client`           | Get all clients (supports filters: `name`, `lastName`) |
| GET    | `/api/client/:clientId` | Get specific client                                    |
| PATCH  | `/api/client/:clientId` | Update client                                          |
| DELETE | `/api/client/:clientId` | Delete client (cascades to sheets and hair services)   |

### Sheet

| Method | Endpoint                            | Description                                                            |
| ------ | ----------------------------------- | ---------------------------------------------------------------------- |
| POST   | `/api/sheet`                        | Create a new sheet with hair services                                  |
| GET    | `/api/sheet/:sheetId`               | Get specific sheet                                                     |
| GET    | `/api/sheet/client/:clientId`       | Get all sheets for a client (supports `limit`, `skip`, `sort` by date) |
| PATCH  | `/api/sheet/:sheetId`               | Update sheet                                                           |
| PATCH  | `/api/sheet/change-client/:sheetId` | Move sheet to another client                                           |
| DELETE | `/api/sheet/:sheetId`               | Delete sheet (cascades to hair services)                               |

### Hair Service

Hair services are created and managed within the Sheet. When creating or updating a sheet, you can include an array of hair services, each containing:

- Service type and technique
- Notes
- Hair service ingredients (products used)

---

## Query Parameters

### Pagination

The following endpoints support pagination:

- `GET /api/client` - Get all clients
- `GET /api/sheet/client/:clientId` - Get all sheets for a client

| Parameter | Description                                 |
| --------- | ------------------------------------------- |
| `limit`   | Limit number of results (default: 20)       |
| `skip`    | Skip results for pagination                 |
| `sort`    | Sort by date (`ASC` or `DESC`) - sheet only |

### Client Filters

| Parameter  | Description                                                   |
| ---------- | ------------------------------------------------------------- |
| `name`     | Filter clients by name (partial match, case-insensitive)      |
| `lastName` | Filter clients by last name (partial match, case-insensitive) |

---

## Cascading Deletes

When deleting an entity, all associated data is automatically removed:

- Deleting a **Client** removes all their **Sheets** and **Hair Services**
- Deleting a **Colorist** removes all their **Clients**, **Sheets**, and **Hair Services**

---

## Security Features

- **JWT Authentication** - Secure token-based auth with 1-day expiration
- **Helmet** - Security headers middleware
- **CORS** - Cross-Origin Resource Sharing enabled
- **Rate Limiting** - Throttler to prevent brute-force attacks
- **Validation** - DTO validation with class-validator
- **Whitelist** - Only validated properties accepted in requests

---

## Request Logger

The app includes a custom logger that captures all incoming requests with:

- HTTP method and path
- Request body (sanitized)
- Response status and time

This helps debug issues and monitor API usage in production.

---

## Swagger

Interactive API documentation is available in **development** environments at:

```
http://localhost:<PORT>/api/docs
```

> **Note:** Swagger is not exposed in production for security reasons.

---

## Local Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or remote instance)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
# Server
ENV=development
PORT=3000

# Database
DB_URL=mongodb://localhost:27017
DB_NAME=colorist-app
DB_PARAMS=authSource=admin

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=14d

# Security
PASSWORD_SALT=your-random-salt-value
```

### Running the App

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

The server will start at `http://localhost:3000/api`

### Running Tests

```bash
# Unit tests
npm run test

# Unit tests with watch mode
npm run test:watch

# Tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## Quick Start Guide

1. **Create your colorist account**

   ```
   POST /api/colorist
   ```

   Save the returned `_id` as `COLORIST_ID`.

2. **Sign in to get your access token**

   ```
   POST /api/auth/sign-in
   ```

   Use your `email` or `username` with your password. Save the returned `access_token`.

3. **Set the authorization header for all subsequent requests**

   ```
   Authorization: Bearer <access_token>
   ```

4. **Create your first client**

   ```
   POST /api/client
   ```

   Save the returned `_id` as `CLIENT_ID`.

5. **Create a sheet with hair services**

   ```
   POST /api/sheet
   ```

   Pass `CLIENT_ID` in the body. Save the returned `_id` as `SHEET_ID`.

6. **Query your data**

   - Get your profile: `GET /api/colorist`
   - Get all clients: `GET /api/client`
   - Get a specific client: `GET /api/client/:CLIENT_ID`
   - Get sheets for a client: `GET /api/sheet/client/:CLIENT_ID`
   - Get a specific sheet: `GET /api/sheet/:SHEET_ID`

7. **Update or delete as needed** using the endpoints above
