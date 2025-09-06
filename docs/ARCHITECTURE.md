# Architecture Overview

This project follows a modular monolith with clean/hexagonal principles. The core idea: business logic is framework-agnostic, and adapters (HTTP/DB) live at the edges.

## Layers
- Domain (`src/domain`): entities and repository ports. Pure TS, no framework imports.
- Application (`src/application`): use-cases orchestrating domain logic. Depends on domain ports.
- Infrastructure (`src/infrastructure`): adapters implementing ports (e.g., Prisma repositories).
- Web (`src/infrastructure/http` + `src/modules`): Express controllers/routes/middleware (presentation).
- Shared (`src/shared`): cross-cutting utilities (auth, logger, errors, middleware, utils).

## Dependency Rule
web → application → domain; infrastructure implements domain ports and is wired through a small container.

## Composition
- `src/application/container.ts` wires repositories (Prisma) to use-cases.
- Controllers call use-cases; no direct DB calls in controllers.

## Example (Auth)
- Domain: `domain/user/user.ts`, `domain/user/user.repository.ts`
- Adapter: `infrastructure/prisma/repositories/user.repository.prisma.ts`
- Use-cases: `application/auth/{register-user,login-user,get-me}.usecase.ts`
- Controllers: `modules/auth/*.ts` call use-cases via the container.

## Testing
- Unit: test use-cases with in-memory/mocked repositories.
- Integration: Supertest on Express app without binding a port.

## Conventions
- Keep entities/ports minimal for MVP; grow with features.
- comments should be all small case (see AGENTS.md).
