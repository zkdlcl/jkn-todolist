# JKN-TODOLIST Project Context

## Project Overview

JKN-TODOLIST is an authentication-based ToDoList application designed for users to manage personal tasks alongside common schedules like public holidays. The application is built with a Node.js + Express backend and React 18 frontend, using PostgreSQL database with JWT authentication.

### Core Features
- User authentication and authorization (JWT-based with Access/Refresh tokens)
- Personal todo management with creation, editing, completion, and soft deletion
- Trash bin functionality for recovered deleted todos
- Public holidays management for all users
- Todo filtering, sorting, and priority management
- Role-based access control (USER/ADMIN)

### Architecture & Tech Stack
- **Backend**: Node.js + Express.js
- **Frontend**: React 18 with Zustand for state management
- **Database**: PostgreSQL (with Supabase for hosting)
- **Authentication**: JWT tokens with 15-minute access tokens and 7-day refresh tokens
- **Styling**: Tailwind CSS
- **API**: RESTful API with JSON responses
- **Deployment**: Vercel for frontend and backend, Supabase for PostgreSQL

## Development Conventions

### Code Structure
The project follows a layered architecture with clear separation of concerns:
- Controllers: Handle HTTP requests/responses
- Services: Implement business logic
- Repositories: Handle database operations
- Middlewares: Authentication, validation, error handling

### Naming Conventions
- Variables and functions: `camelCase`
- Classes and components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files and directories: `kebab-case`

### Testing Strategy
- Target: 70% test coverage
- Unit tests: 70% (business logic, utilities)
- Integration tests: 20% (API endpoints)
- E2E tests: 10% (key user flows)

## Key Requirements

### Functional Requirements
1. User registration and login with email/password
2. Todo CRUD operations (Create, Read, Update, Delete)
3. Soft deletion with trash bin functionality
4. Todo completion toggling
5. Priority management (LOW/MEDIUM/HIGH)
6. Date/time management with start/due dates
7. Public holidays management (admin only)
8. Filter and sort todos

### Security Requirements
- Passwords hashed using bcrypt with 10 rounds
- JWT tokens with proper expiration
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Rate limiting

### Non-functional Requirements
- API response time: P95 < 500ms
- Support for 100 concurrent users
- 99% system availability
- 70% test coverage
- HTTPS enforcement in production

## Building and Running

### Environment Setup
1. Create `.env` files based on `.env.example`
2. Set up PostgreSQL database (local or Supabase)
3. Install dependencies with `npm install`

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
# Backend tests
npm run test:coverage

# Frontend tests
npm run test
```

### Deployment
- Frontend: Deploy to Vercel
- Backend: Deploy to Vercel as Serverless Functions
- Database: PostgreSQL via Supabase
- Environment variables must be configured in deployment environment

## Key Design Principles

### SOLID Principles
- Single Responsibility: Each module has one clear responsibility
- Open/Closed: Open for extension, closed for modification
- Liskov Substitution: Subtypes can replace their base types
- Interface Segregation: Small, focused interfaces
- Dependency Inversion: Depend on abstractions, not concretions

### Project Values
1. Speed: 3-day MVP release (Phase 0-2)
2. Quality: 70% test coverage for stability
3. Scalability: Flexible architecture for future features
4. Maintainability: Clear code structure and documentation
5. Security: JWT, bcrypt, HTTPS, CORS

## Project Structure

### Backend Structure
```
backend/
├── api/                    # Vercel Serverless Function entry
├── src/
│   ├── controllers/        # HTTP request handling
│   ├── services/           # Business logic
│   ├── repositories/       # Database operations
│   ├── middlewares/        # Authentication, logging, error handling
│   ├── routes/             # API routing
│   ├── utils/              # Utility functions
│   ├── errors/             # Custom error classes
│   ├── config/             # Configuration
│   └── validators/         # Input validation
├── migrations/            # Database migrations
└── tests/                 # Test files
```

### Frontend Structure
```
frontend/
├── src/
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   ├── stores/            # Zustand state management
│   ├── services/          # API services
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utility functions
└── tests/                 # Test files
```

## Important Files and Documentation

### Core Documentation
- `docs/0-domain-definition-request.md` - Initial project definition request
- `docs/1-domain-definition.md` - Comprehensive domain definition
- `docs/2-product-requirements.md` - Product requirements specification
- `docs/3-user-scenarios.md` - Detailed user scenarios
- `docs/4-project-structure-principles.md` - Architecture and structure principles

### Key Implementation Details
- Soft deletion strategy using `deleted_status` field instead of physical deletion
- Separate `PublicHoliday` table from `Todo` table for better separation of concerns
- JWT refresh token stored in database for invalidation capability
- Priority management using numeric values (LOW=1, MEDIUM=2, HIGH=3)
- Role-based access control (ROLE_USER, ROLE_ADMIN)

## Security Considerations

### Authentication & Authorization
- JWT tokens with short-lived access tokens (15 minutes) and longer refresh tokens (7 days)
- Refresh tokens stored encrypted in database and invalidated on logout
- Role-based access control for different user types
- Input validation with strict requirements for passwords and emails

### Data Protection
- Passwords hashed using bcrypt with minimum 10 rounds
- Parameterized queries to prevent SQL injection
- Input sanitization to prevent XSS attacks
- Rate limiting to prevent abuse

## Testing Approach

The project implements a test pyramid strategy:
- 70% Unit tests for business logic and utilities
- 20% Integration tests for API endpoints
- 10% E2E tests for critical user flows

Key test scenarios include:
- User registration and authentication flows
- Todo creation, modification, and deletion
- Trash bin operations (restore, permanent deletion)
- Role-based access control
- Input validation and error handling

## Deployment Strategy

- Backend: Vercel Serverless Functions with PostgreSQL on Supabase
- Frontend: Vercel static hosting
- Environment-specific configuration for development, staging, and production
- HTTPS enforced in production environments
- CORS configuration for secure API access

## 반드시 지켜야 할 것
 - 모든 입출력은 한국어로 할 것
 - 오버엔지니어링 금지
 