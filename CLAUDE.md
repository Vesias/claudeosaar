# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

ClaudeOSaar is a sovereign AI development workspace OS that provides containerized development environments with native Claude CLI integration. The system follows a multi-tenant SaaS architecture with isolated user workspaces.

### High-Level Architecture

1. **Frontend Layer**: Next.js 15 with Pages Router, React 19, Tailwind CSS 4
2. **API Layer**: Dual backend with Node.js (TypeScript) and Python (FastAPI)  
3. **Container Layer**: Docker-based workspace isolation with AppArmor security
4. **AI Integration**: MCP Server protocol for Claude integration
5. **Data Layer**: PostgreSQL + pgvector for embeddings, Redis for caching, Qdrant for vector search

### Container Architecture

Each user workspace runs in an isolated Docker container with:
- Resource limits based on subscription tier (Free: 512MB/0.5CPU, Pro: 2GB/2CPU, Enterprise: 8GB/4CPU)
- Persistent volume mounting at `/user_mounts/{user_id}/{workspace_id}`
- AppArmor security profiles for container hardening
- Network isolation via Docker networks

### AI Integration Architecture

The system integrates with Claude through:
- MCP (Model Context Protocol) server for tool execution
- A2A Protocol for multi-agent communication (planned)
- Custom agent templates in `.claude/agents/`
- Prompt enhancement system in `.claude/prompt-enhancer/`
- Memory Bank for persistent context storage

## Common Development Commands

### Development Servers
```bash
# Start API server (Node.js) on port 6600
npm run dev

# Start Python API server (FastAPI) on port 6600
npm run dev:python

# Start Next.js UI on port 6601
npm run dev:ui

# Start all services concurrently
npm run dev:all

# Start MCP server separately (uses mock server at .claude/mcp-server/mock-server/server.js)
npm run dev:mcp
```

### Building and Testing
```bash
# Build TypeScript API
npm run build

# Build Next.js UI
npm run build:ui

# Run tests with Jest
npm test

# Lint TypeScript/React code
npm run lint

# Type check without emitting
npm run typecheck
```

### Docker Container Management
```bash
# Build Docker containers
npm run docker:build

# Start containers (uses containers/docker-compose.yaml)
npm run docker:up

# Stop containers
npm run docker:down

# Start all services with environment checks
./start.sh

# Start individual workspace container
.claude/scripts/start-container.sh <user_id> <workspace_id> <api_key> <tier>
```

### Release Management
```bash
# Generate next release plan
npm run release

# Run CLI commands
npm run cli
```

## Development Workflows

### Local Development Setup
1. Copy `.env.example` to `.env` and fill in required values (API keys, database passwords)
2. Install dependencies: `npm install`
3. Start databases: `docker-compose -f containers/docker-compose.yaml up api-db cache vector-db`
4. Run migrations: `npm run migrate` (when available)
5. Start development servers: `npm run dev:all`

### Testing Workflow
- Jest is configured for unit testing
- Run all tests: `npm test`
- Run tests in watch mode: `npm test -- --watch`
- Run tests for a specific file: `npm test -- --testPathPattern="filename"`
- Integration tests require running databases

### Working with the MCP Server
1. The MCP server runs on port 6602 by default
2. Configuration is in `.claude/mcp-server/config.json`
3. Start with `./dev-mcp.sh` or `npm run dev:mcp`
4. Uses mock server implementation in development

### Managing User Workspaces
1. Workspaces are created with: `.claude/scripts/start-container.sh`
2. Each workspace gets isolated storage at `/user_mounts/{user_id}/{workspace_id}`
3. Resource limits are applied based on subscription tier
4. Containers use AppArmor security profiles for isolation

## Key Project Components

### API Endpoints
- `/api/workspace/create` - Create new workspace
- `/api/workspace/{id}` - Get workspace details
- `/api/workspace/{id}` - Delete workspace
- `/api/memory-bank/store` - Store context
- `/api/memory-bank/retrieve` - Retrieve context
- `/api/memory-bank/search` - Search stored context

### Frontend Structure
- Pages in `src/pages/` using Next.js Pages Router
- Components in `src/components/`
- Context providers in `src/context/`
- Authentication via `withAuth` HOC

### Configuration Files
- `.claude/mcp-server/config.json` - MCP server configuration
- `.claude/agents/*.json` - Agent templates
- `.claude/prompt-enhancer/config.json` - Prompt enhancement rules

## Security Considerations

- API keys are stored as environment variables
- AppArmor profiles are enforced on containers (`containers/security/apparmor/`)
- Network isolation between user workspaces
- Resource limits prevent abuse

## Subscription Tiers

- **Free**: 512MB RAM, 0.5 CPU, 5GB storage
- **Pro**: €13.99/mo - 2GB RAM, 2 CPU, 50GB storage
- **Enterprise**: €21.99/mo - 8GB RAM, 4 CPU, 100GB storage, multi-agent support

## Memory Bank and Context Storage

The Memory Bank system (`ai_docs/memory-bank/`) stores:
- Development progress tracking
- Release planning documents
- Technology research summaries
- Plugin system documentation

Access patterns:
- Store: `POST /api/memory-bank/store`
- Retrieve: `GET /api/memory-bank/retrieve`
- Search: `GET /api/memory-bank/search`

## Environment Configuration

Key environment variables (see `.env.example` for complete list):
- `ANTHROPIC_API_KEY`: Claude API key for AI integration
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection for caching and sessions
- `JWT_SECRET`: Secret for JWT token signing
- `MCP_SERVER_PORT`: MCP server port (default: 6602)
- `STRIPE_SECRET_KEY`: Stripe API key for billing

Default ports:
- API Server: http://localhost:6600
- Frontend UI: http://localhost:6601
- MCP Server: http://localhost:6602
- Grafana: http://localhost:6603 (Docker)
- A2A Coordinator: http://localhost:6604 (Docker)

## Development Guidelines

### Code Organization
- Use TypeScript for type safety
- Follow the existing file structure patterns
- Components go in `src/components/` for frontend
- API routes in `src/api/` for backend
- Container management code in `src/containers/`

### Working with Docker Containers
- Each user workspace gets its own container
- Containers are networked via `claude-net` bridge network
- Resource limits are enforced via Docker's `--memory`, `--cpus` flags
- AppArmor profiles in `containers/security/apparmor/`

### Authentication Flow
1. Users authenticate via JWT tokens
2. Tokens are stored in HTTP-only cookies
3. WebSocket connections use token-based auth
4. Each workspace has isolated API key storage

### Plugin Development
1. Create plugin in `.claude/plugins/` directory
2. Follow BasePlugin interface from `src/plugins/base.ts`
3. Register plugin in configuration
4. Implement lifecycle methods: `initialize()`, `cleanup()`