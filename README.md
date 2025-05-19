# ClaudeOSaar - AI Development Workspace OS

ClaudeOSaar is a sovereign AI development workspace operating system designed for professional developers and AI agent builders. It provides isolated, containerized development environments with native Claude CLI integration, enabling rapid AI-powered software development.

## ⚠️ Wichtiger Lizenzhinweis

Dieses Repository ist **öffentlich einsehbar, aber proprietär**. Es ist **nicht** als Open-Source-Projekt lizenziert.

- ✅ Sie dürfen den Code ansehen und inspizieren
- ❌ Sie dürfen den Code nicht klonen, kopieren oder für eigene Projekte verwenden
- ❌ Sie dürfen keine abgeleiteten Werke erstellen

Bitte lesen Sie die [LICENSE](LICENSE)-Datei für vollständige Details zu den Nutzungsbedingungen.

## Features

- **Containerized Workspaces**: Docker-based isolated environments per user
- **Claude CLI Integration**: Native Anthropic Claude Code support  
- **MCP Server**: Model Context Protocol for enhanced AI capabilities
- **Memory Bank**: Persistent context storage and retrieval system
- **Multi-tenant Support**: User isolation with resource limits based on subscription tier
- **Plugin System**: Extensible architecture for custom integrations

## Quick Start

1. Clone the repository
```bash
git clone https://github.com/claudeosaar/claudeosaar.git
cd claudeosaar
```

2. Set up environment
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

3. Start all services
```bash
./start.sh
```

4. Access the UI at http://localhost:6601

## Development

```bash
# Start individual services
npm run dev          # API server (Node.js)
npm run dev:python   # API server (Python/FastAPI)
npm run dev:ui       # Frontend UI
npm run dev:mcp      # MCP server
npm run dev:all      # All services concurrently

# Docker operations
npm run docker:build # Build containers
npm run docker:up    # Start containers
npm run docker:down  # Stop containers

# Testing and linting
npm test            # Run tests
npm run lint        # Lint code
npm run typecheck   # Type checking
```

## Service URLs

- **UI**: http://localhost:6601
- **API**: http://localhost:6600
- **MCP Server**: http://localhost:6602
- **Qdrant**: http://localhost:6333
- **Grafana**: http://localhost:6603
- **A2A Coordinator**: http://localhost:6604

## Project Structure

```
.claude/                    # Claude workspace configuration
├── agents/                 # AI agent templates and configurations
├── commands/               # Custom Claude CLI commands
├── mcp-server/             # MCP server implementation
├── plugins/                # Plugin system configuration
├── profiles/               # User profiles and preferences
├── projekts/               # Project management
├── prompt-enhancer/        # Prompt optimization tools
├── researches/             # Research context storage
├── scripts/                # Automation scripts
├── store/                  # State management
└── vibe-coding/            # Vibe-based coding assistance

ai_docs/                    # AI documentation
└── memory-bank/            # Versioned context storage

src/                        # Source code
├── api/                    # REST API endpoints
├── billing/                # Subscription management
├── containers/             # Container orchestration
├── core/                   # Core business logic
├── plugins/                # Plugin system
└── ui/                     # User interface components

containers/                 # Container configuration
├── docker-compose.yaml     # Service orchestration
└── security/               # Security profiles
    └── apparmor/           # AppArmor profiles
```

## Environment Variables

Required environment variables in `.env`:

```bash
# Claude API
CLAUDE_API_KEY=your_anthropic_key
CLAUDE_MODEL=claude-3-opus-20240229
CLAUDE_MAX_TOKENS=4096

# Database
DATABASE_URL=postgresql://claude:password@localhost:5432/claudeosaar
DB_PASSWORD=your-secure-password
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret-key

# Stripe (for billing)
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# MCP Server
MCP_SERVER_PORT=6602

# Environment
NODE_ENV=development
API_PORT=6600
UI_PORT=6601
```

## Subscription Tiers

- **Free**: 512MB RAM, 0.5 CPU, 5GB storage
- **Pro** (€13.99/mo): 2GB RAM, 2 CPU, 50GB storage
- **Enterprise** (€21.99/mo): 8GB RAM, 4 CPU, 100GB storage, multi-agent support

## License

Proprietary - ClaudeOSaar GmbH 2024

## Support

- Documentation: https://docs.claudeosaar.saarland
- Issues: https://github.com/claudeosaar/claudeosaar/issues
- Email: support@claudeosaar.saarland