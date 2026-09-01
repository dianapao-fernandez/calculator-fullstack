# Full-Stack Calculator

A modern, production-grade calculator web application built with a Go backend and a React + TypeScript frontend, designed with a realistic physical calculator aesthetic.

---

## Prerequisites

- **Go**: `1.21` or higher
- **Node.js**: `20.x` or higher (`npm` included)
- **Docker & Docker Compose**: Optional (recommended for containerized execution)
- **Make**: Optional (for convenient build automation)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/dianapao-fernandez/calculator-fullstack.git
cd calculator-fullstack
```

### 2. Backend Installation
```bash
cd backend
go mod download
cd ..
```

### 3. Frontend Installation
```bash
cd frontend
npm ci
cd ..
```

---

## How to Run

### Option A: Docker (Recommended)
Build and start both services containerized (Frontend on `:80`, Backend on `:8080`, with Nginx reverse proxying `/api` requests):

```bash
# Using Make
make docker

# Or directly with Docker Compose
docker compose up --build
```
Access the application at `http://localhost`.

---

### Option B: Local Development

#### 1. Start the Backend
Runs on `http://localhost:8080`:
```bash
# Using Make
make dev-backend

# Or directly
cd backend && go run cmd/api/main.go
```

#### 2. Start the Frontend
Runs on `http://localhost:3000` (proxies `/api` calls to `http://localhost:8080`):
```bash
# Using Make
make dev-frontend

# Or directly
cd frontend && npm run dev
```

#### 3. Run Both Concurrently (Make)
```bash
make dev
```

---

## API Examples

All endpoints accept and return JSON payloads.

### 1. Addition (`POST /api/add`)
```bash
curl -X POST http://localhost:8080/api/add \
  -H "Content-Type: application/json" \
  -d '{"a": 15, "b": 27}'
```
**Response (`200 OK`)**:
```json
{
  "result": 42
}
```

### 2. Subtraction (`POST /api/subtract`)
```bash
curl -X POST http://localhost:8080/api/subtract \
  -H "Content-Type: application/json" \
  -d '{"a": 50, "b": 8}'
```
**Response (`200 OK`)**:
```json
{
  "result": 42
}
```

### 3. Multiplication (`POST /api/multiply`)
```bash
curl -X POST http://localhost:8080/api/multiply \
  -H "Content-Type: application/json" \
  -d '{"a": 6, "b": 7}'
```
**Response (`200 OK`)**:
```json
{
  "result": 42
}
```

### 4. Division (`POST /api/divide`)
**Valid Operation**:
```bash
curl -X POST http://localhost:8080/api/divide \
  -H "Content-Type: application/json" \
  -d '{"a": 84, "b": 2}'
```
**Response (`200 OK`)**:
```json
{
  "result": 42
}
```

**Division by Zero**:
```bash
curl -X POST http://localhost:8080/api/divide \
  -H "Content-Type: application/json" \
  -d '{"a": 42, "b": 0}'
```
**Response (`400 Bad Request`)**:
```json
{
  "error": "division by zero"
}
```

### 5. Exponentiation (`POST /api/power`)
```bash
curl -X POST http://localhost:8080/api/power \
  -H "Content-Type: application/json" \
  -d '{"a": 2, "b": 8}'
```
**Response (`200 OK`)**:
```json
{
  "result": 256
}
```

### 6. Square Root (`POST /api/sqrt`)
**Valid Operation**:
```bash
curl -X POST http://localhost:8080/api/sqrt \
  -H "Content-Type: application/json" \
  -d '{"a": 81}'
```
**Response (`200 OK`)**:
```json
{
  "result": 9
}
```

**Negative Square Root**:
```bash
curl -X POST http://localhost:8080/api/sqrt \
  -H "Content-Type: application/json" \
  -d '{"a": -9}'
```
**Response (`400 Bad Request`)**:
```json
{
  "error": "square root of negative number"
}
```

### 7. Percentage (`POST /api/percentage`)
```bash
curl -X POST http://localhost:8080/api/percentage \
  -H "Content-Type: application/json" \
  -d '{"a": 50, "b": 20}'
```
**Response (`200 OK`)**:
```json
{
  "result": 10
}
```

---

## Design Decisions

- **Go Standard Library Only (`net/http`)**: Zero third-party web framework dependencies. Avoids dependency bloat, and provides high performance with standard library idioms.
- **Custom React Hook (`useCalculator`)**: State management and business logic are fully decoupled from UI rendering. Enables isolated unit testing without requiring DOM rendering.
- **CSS Modules**: Strict style encapsulation preventing global namespace collisions. Provides zero-runtime CSS overhead, clean maintainability, and predictable modular styles.
- **Physical LED Design**: Realistic calculator aesthetic featuring recessed 7-segment-style LED display, 3D beveled buttons with tactile feedback, and distinct operational color zoning. Bridges tactile physical affordance with modern digital interface craft.
- **Responsive Layout Strategy**:
  - *Desktop*: Centered, skeuomorphic physical device chassis with elevation shadows.
  - *Mobile*: Fluid full-viewport vertical layout optimized for touch targets and thumb ergonomics.
- **Security & Reliability**:
  - Explicit CORS headers on API endpoints.
  - Robust JSON decoding and payload validation.
  - Custom panic recovery middleware to prevent server crashes without leaking internal stack traces or sensitive data.
  - Structured, predictable error responses.

---

## Project Structure

```
calculator-fullstack/
├── Makefile
├── docker-compose.yml
├── README.md
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go              # Entrypoint and HTTP routing
│   ├── internal/
│   │   ├── calculator/
│   │   │   ├── calculator.go        # Mathematical logic
│   │   │   └── calculator_test.go   # Unit tests for operations
│   │   ├── handlers/
│   │   │   ├── handlers.go          # HTTP request handlers
│   │   │   └── handlers_test.go     # Handler unit tests
│   │   └── middleware/
│   │       └── middleware.go        # CORS, logging, and recovery
│   ├── pkg/
│   │   └── errors/
│   │       └── errors.go            # Common domain error definitions
│   ├── Dockerfile
│   └── go.mod
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Button/              # 3D Tactile keypad buttons
    │   │   │   ├── Button.tsx
    │   │   │   ├── Button.module.css
    │   │   │   └── Button.test.tsx
    │   │   ├── Calculator/          # Main calculator container
    │   │   │   ├── Calculator.tsx
    │   │   │   ├── Calculator.module.css
    │   │   │   └── Calculator.test.tsx
    │   │   └── Display/             # LED display component
    │   │       ├── Display.tsx
    │   │       ├── Display.module.css
    │   │       └── Display.test.tsx
    │   ├── hooks/
    │   │   ├── useCalculator.ts     # Calculator state machine & logic
    │   │   └── useCalculator.test.ts
    │   ├── services/
    │   │   └── api.ts               # HTTP client service
    │   ├── types/
    │   │   └── calculator.ts        # TypeScript data contracts
    │   ├── App.tsx
    │   ├── App.css
    │   ├── App.test.tsx
    │   ├── main.tsx
    │   └── setupTests.ts
    ├── Dockerfile                   # Multi-stage production build
    ├── index.html
    ├── nginx.conf                   # Production Nginx reverse proxy configuration
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## Testing

### Run All Tests
```bash
# Using Make
make test
```

### Backend Tests & Coverage
```bash
cd backend
go test ./... -v -cover
```
*To generate and view an HTML coverage report:*
```bash
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

### Frontend Tests & Coverage
```bash
cd frontend
npm run test -- --run
```
*To generate and view frontend test coverage:*
```bash
npm run coverage
```

---

## Cleaning Up
To stop Docker containers and remove build artifacts (`dist` and `bin`):
```bash
# Using Make
make clean

# Or directly
docker compose down -v
rm -rf backend/bin frontend/dist
```

