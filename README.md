# Card Validation API

A robust, production-grade Card Validation RESTful API built with **Node.js**, **Express.js**, and **TypeScript** (enforcing `strict: true`).

The API provides an endpoint to validate credit/debit card numbers using the standard **Luhn Algorithm (Modulus 10)**, performs card brand identification, and gracefully handles edge cases and malformed input.

---

## Features

- **Luhn Algorithm Validation**: Computes and validates card checksums using the standard Modulus 10 algorithm.
- **Card Brand Detection**: Automatically identifies card brand issuers (Visa, Mastercard, American Express, Discover, JCB, Diners Club, UnionPay, Maestro).
- **Input Sanitization**: Automatically strips internal whitespace and hyphens before evaluation (e.g. `4532 0151 1283 0366` -> `4532015112830366`).
- **Strict Input & Edge Case Handling**: Validates payload structure, types, card lengths (12–19 digits), and non-numeric characters with informative status codes (`400 Bad Request` vs `200 OK`).
- **Clean Layered Architecture**: Clear separation of concerns into Routes, Middlewares, Controllers, and Services.
- **Strict TypeScript Compliance**: Written with `"strict": true` enabled in `tsconfig.json`.
- **Comprehensive Test Suite**: Includes both Unit tests (services) and Integration tests (HTTP endpoints).

---

## Project Architecture

```
src/
├── app.ts                         # Express application configuration
├── server.ts                      # Server entry point
├── controllers/
│   └── card.controller.ts         # HTTP request/response handler
├── middlewares/
│   ├── error-handler.middleware.ts# Global error handling (JSON parsing, 500s)
│   └── validate-dto.middleware.ts # Request body validation middleware
├── routes/
│   └── card.routes.ts             # API route definitions
└── services/
    └── card.service.ts            # Business logic (Luhn check, brand detection)

tests/
├── unit/
│   └── card.service.test.ts       # Service unit tests
└── integration/
    └── card.route.test.ts        # Express endpoint integration tests
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- `npm` package manager

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd tobams
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Running the Application

### Development Mode
Starts the server with hot reloading via `ts-node-dev`:
```bash
npm run dev
```
The server will run at `http://localhost:3000`.

### Production Build & Execution
1. Compile TypeScript into JavaScript:
   ```bash
   npm run build
   ```
2. Start the compiled server:
   ```bash
   npm start
   ```

---

## Running Tests

Run the full automated test suite (Unit & Integration tests):
```bash
npm test
```

---

## API Specification

### Endpoint: `POST /api/cards/validate`

#### Request Headers
| Header | Value |
| --- | --- |
| `Content-Type` | `application/json` |

#### Request Body
| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `cardNumber` | `string` | **Yes** | The credit/debit card number string (supports `card_number` alias). |

---

### Response Examples

#### 1. Valid Card Number (`200 OK`)
**Request:**
```json
{
  "cardNumber": "4532 0151 1283 0366"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "cardNumber": "4532015112830366",
    "isValid": true,
    "cardBrand": "Visa",
    "message": "Card number is valid."
  }
}
```

#### 2. Invalid Card Checksum (`200 OK`)
**Request:**
```json
{
  "cardNumber": "4532015112830367"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "cardNumber": "4532015112830367",
    "isValid": false,
    "cardBrand": "Visa",
    "message": "Card number failed Luhn checksum validation."
  }
}
```

#### 3. Missing Input Field (`400 Bad Request`)
**Request:**
```json
{}
```
**Response:**
```json
{
  "success": false,
  "error": {
    "code": "MISSING_CARD_NUMBER",
    "message": "Card number is required. Please provide a \"cardNumber\" field in the request body."
  }
}
```

#### 4. Invalid Input Type (`400 Bad Request`)
**Request:**
```json
{
  "cardNumber": 1234567890123456
}
```
**Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TYPE",
    "message": "Card number must be provided as a string."
  }
}
```

---

## cURL Usage Examples

```bash
# Valid Card Test
curl -X POST http://localhost:3000/api/cards/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4532015112830366"}'

# Formatted Card Test (with hyphens)
curl -X POST http://localhost:3000/api/cards/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "3782-822468-31005"}'

# Invalid Input Test
curl -X POST http://localhost:3000/api/cards/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": ""}'
```

---

## Key Design & Technical Decisions

1. **Luhn Algorithm (MOD 10)**:
   - **Why**: ISO/IEC 7812 standardizes payment card numbering. The Luhn algorithm is the global standard for detecting accidental mistypings or transposed digits.
2. **HTTP Status Code Rationale**:
   - `200 OK`: Returned when the request payload is well-formed and the server successfully evaluates card validity (whether `isValid` is `true` or `false`).
   - `400 Bad Request`: Returned when the request payload is malformed (e.g. invalid JSON, missing required fields, or incorrect non-string data types).
3. **Card Brand Detection**:
   - Extends basic validation to provide richer feedback (identifying Visa, Mastercard, Amex, Discover, etc.), mimicking real payment gateway responses.
4. **Strict TypeScript Config**:
   - `"strict": true` is enforced to prevent null/undefined runtime errors and guarantee type safety across all components.
