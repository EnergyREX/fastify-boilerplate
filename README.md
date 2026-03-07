# ⚡ Fastify Boilerplate

A production-ready boilerplate for backend projects built with **Fastify** and **TypeScript**, following **Hexagonal Architecture** with DDD principles.

Built and maintained by [EnergyREX](https://energyrex.dev).

---

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Fastify
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Auth:** JWT + Refresh Tokens (via cookies)
- **Docs:** Swagger (via `@fastify/swagger`)
- **Testing:** Jest
- **Queue:** BullMQ *(optional)*

---

## Architecture

This boilerplate follows **Hexagonal Architecture** (Ports & Adapters) with DDD-inspired domain modeling.

```
src/
├── application/        # Use cases, application errors, DTOs
├── bootstrap/          # App initialization, DI containers
├── config/             # Plugins, database config
├── domain/             # Entities, Value Objects, factories, repository interfaces
├── infrastructure/     # Drizzle schema, repository implementations
└── presentation/       # Fastify routes, request types
```

### Domain structure example

```
domain/users/
├── aggregates/         # User, Role
├── factories/          # User.factory, Role.factory
├── repositories/       # IUserRepository (interface)
├── value-objects/      # Email, Password
├── errors/             # UserRepositoryError
└── tests/              # Unit tests per VO and aggregate
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL instance running
- Copy `.env.example` to `.env` and fill in your values

### Installation

```bash
git clone https://github.com/EnergyREX/fastify-boilerplate.git my-project
cd my-project
npm install
```

### Database

```bash
# Run migrations
npx drizzle-kit migrate
```

### Development

```bash
npm run dev
```

### Testing

```bash
npm run test
```

---

## What's included out of the box

- ✅ JWT authentication with refresh token rotation
- ✅ Cookie-based token storage
- ✅ CORS configured
- ✅ Swagger docs at `/docs`
- ✅ Drizzle ORM with migration support
- ✅ Domain layer with Value Objects (`Email`, `Password`, `UUID`)
- ✅ Result pattern for error handling
- ✅ Jest configured for unit testing

---

## Roadmap

- [ ] Multiple branch variants (no-auth, fullstack, minimal)
- [ ] EnergyREX Artisan integration — CLI scaffolding tool to generate domains, use cases, routes and more from the terminal

---

## Related Projects

| Project | Description |
|---|---|
| [EnergyREX Artisan](https://github.com/EnergyREX/enartisan) | CLI tool to scaffold boilerplate based on this architecture |
| [OpenATS](https://github.com/EnergyREX/openats) | Open-source ATS built on top of this boilerplate |

---

## License

MIT