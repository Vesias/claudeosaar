# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

ClaudeOSaar is a sovereign AI development workspace OS that provides containerized development environments with native Claude CLI integration. The system follows a multi-tenant SaaS architecture with isolated user workspaces.

### High-Level Architecture

1. **Frontend Layer**: Next.js 15 with App Router, React 19, Tailwind CSS 4
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

# Start MCP server separately
npm run dev:mcp
```

### Building and Testing
```bash
# Build TypeScript API
npm run build

# Build Next.js UI
npm run build:ui

# Run tests
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

# Start containers
npm run docker:up

# Stop containers
npm run docker:down

# Start containers with script (includes checks)
./start-containers.sh

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

### Running Tests
- Jest is configured for unit testing
- Run all tests: `npm test`
- Run tests in watch mode: `npm test -- --watch`
- Run tests for a specific file: `npm test -- --testPathPattern="filename"`

### Working with the MCP Server
1. The MCP server runs on port 6602 by default
2. Configuration is in `.claude/mcp-server/config.json`
3. Start with `./dev-mcp.sh` or `npm run dev:mcp`

### Managing User Workspaces
1. Workspaces are created with: `.claude/scripts/start-container.sh`
2. Each workspace gets isolated storage at `/user_mounts/{user_id}/{workspace_id}`
3. Resource limits are applied based on subscription tier

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