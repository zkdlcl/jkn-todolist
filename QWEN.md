# JKN-TODOLIST Project Context

## 반드시 지켜야 할 것

- 모든 입출력은 한국어로 할 것
- 오버엔지니어링 금지

## Project Overview

JKN-TODOLIST is an authentication-based ToDoList application designed for users to manage personal tasks alongside common schedules like public holidays. The application is built with a Node.js + Express backend and React 18 frontend, using PostgreSQL database with JWT authentication.

### Core Features

- User authentication and authorization (JWT-based with Access/Refresh tokens)
- Personal todo management with creation, editing, completion, and soft deletion
- Trash bin functionality for recovered deleted todos
- Public holidays management for all users
- Todo filtering, sorting, and priority management
- Role-based access control (USER/ADMIN)
- Calendar view to visualize todos and public holidays with date localization

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

### State Management

- Use Zustand for state management in React components
- Import stores using default imports (e.g., `import useTodoStore from '../stores/useTodoStore'`)
- Destructure needed functions and state from the store hook directly in components
- Ensure all date-related functionality is properly localized using date-fns with appropriate locale settings

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
9. Calendar view to visualize todos and public holidays (added with react-big-calendar)

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
