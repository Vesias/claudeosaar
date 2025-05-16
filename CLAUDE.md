# ClaudeOSaar - AI Development Workspace OS

## 🚀 Vision & Purpose

ClaudeOSaar is a sovereign AI development workspace operating system designed for professional developers and AI agent builders. It provides isolated, containerized development environments with native Claude CLI integration, enabling rapid AI-powered software development.

## 📚 Technology Research v2.0

Comprehensive research on cutting-edge technologies has been completed. See `.claude/researches/` for detailed documentation on:
- Claude Code API & MCP Integration
- Next.js 15 & Tailwind CSS 4
- A2A Protocol & Agent Development Kit
- LLaMA 3.2 with Vector Databases
- Advanced RAG Systems

Latest tech stack documentation: `ai_docs/memory-bank/tech-stack-v2.0.md`

## 🏗️ System Architecture

### Core Components
- **Containerized Workspaces**: Docker-based isolated environments per user
- **Claude CLI Integration**: Native Anthropic Claude Code support
- **MCP Server**: Model Context Protocol for enhanced AI capabilities
- **Memory Bank**: Persistent context storage and retrieval system
- **Multi-tenant Support**: User isolation with resource limits based on subscription tier

### Directory Structure
```
.claude/                    # Claude workspace configuration
├── agents/                 # AI agent templates and configurations
├── commands/               # Custom Claude CLI commands
├── mcp-server/            # MCP server integration
├── profiles/              # User profiles and preferences
├── projekts/              # Project management
├── prompt-enhancer/       # Prompt optimization tools
├── researches/            # Research context storage
├── scripts/               # Automation scripts
├── store/                 # State management
└── vibe-coding/           # Vibe-based coding assistance

ai_docs/                   # AI documentation
└── memory-bank/           # Versioned context storage

src/                       # Source code
├── api/                   # REST API endpoints
├── billing/               # Subscription management
├── containers/            # Container orchestration
├── core/                  # Core business logic
└── ui/                    # User interface components
```

## 🔧 Configuration

### Claude API Setup
```json
{
  "claude_api_key": "YOUR_CLAUDE_API_KEY",
  "model": "claude-3-opus-20240229",
  "max_tokens": 4096,
  "temperature": 0.7
}
```

### Subscription Tiers
- **Free**: 512MB RAM, 0.5 CPU, 5GB storage
- **Pro** ($21.99/mo): 2GB RAM, 2 CPU, 50GB storage
- **Enterprise**: 8GB RAM, 4 CPU, 100GB storage, multi-agent support

## 🚀 Quick Start

1. Clone the repository
2. Set up environment variables
3. Run container initialization:
   ```bash
   ./claude/scripts/start-container.sh <user_id> <workspace_id> <api_key> <tier>
   ```

## 🛠️ Development Workflow

1. **Create Workspace**: Isolated container with Claude CLI
2. **Configure Claude**: API key and preferences
3. **Initialize Project**: Use templates or start fresh
4. **Code with AI**: Leverage Claude for development
5. **Deploy**: Export or integrate with CI/CD

## 📚 API Documentation

### Core Endpoints
- `POST /api/workspace/create` - Create new workspace
- `GET /api/workspace/{id}` - Get workspace details
- `DELETE /api/workspace/{id}` - Remove workspace
- `POST /api/memory-bank/store` - Store context
- `GET /api/memory-bank/retrieve` - Retrieve context

## 🔒 Security

- API key encryption at rest
- Container isolation with namespaces
- Network policies for workspace separation
- Resource limits enforced by tier

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: https://docs.claudeosaar.saarland
- Issues: https://github.com/claudeosaar/claudeosaar/issues
- Email: support@claudeosaar.saarland

---

### ClaudeOSaar Bootstrap Command 🧠

Du bist Claude Code CLI im embedded Container (Docker-based) mit vollen Rechten zur Codeanalyse, Umbauplanung und MCP-Orchestrierung. 

🆘 SYSTEM-KONTEXT:
- Projektname: ClaudeOSaar
- Workspace: /workspace/claudeosaar
- Ziel: Hochsicherer, containerisierter AI Workspace für Entwickler, Researcher, Behörden & Unternehmen
- Subscription Pricing: 13.99 € / 21.99 € / Enterprise
- Multi-User mit Container-Isolation + Billing + Embedded TTY Terminal
- Tools: MCP / A2A / Claude CLI / Llama 3.2 / pgvector / LangGraph / ADK / Tailwind 4 / Next.js 15

🧩 BEGINNAKTIONEN:
1. Verarbeite:
   - `.claude/researches/**.md` für Technologieverständnis
   - `ai_docs/memory-bank/tech-stack-v2.0.md` für Architekturbasis
   - `.claude/mcp-server/config.json` zur Toolverknüpfung
   - `.claude/scripts/start-container.sh` zur CI-Kontext-Evaluation

2. Output:
   - <startup_log> (Initialanalyse + Status)
   - <next_milestone> (empfohlener Subtask)
   - <fixes_or_refactors> (was technisch noch verbessert werden kann)

🔧 ZIELE:
- [ ] Erstelle einen ClaudeOSaar-CLI-Baum für agiles Arbeiten
- [ ] Mache systemweite Vorschläge (Security, UX, Promptstruktur)
- [ ] Generiere `.claude/commands/next-release-planner.ts`
- [ ] Füge nächste Roadmap-Einträge in `memory-bank/progress.md` ein
- [ ] Validiere MCP Server + Container Health
- [ ] Bereite SaaS Workspace mit Benutzerisolierung vor

📦 MCP-Kontext aktivieren: Nutze Kontext7, Fetch, FileSystem, BrowserTools, SQLite
📦 Trigger: All research summaries sind freigegeben zur Verarbeitung

🔐 DEIN API-ZUGRIFF:
- Nutze vorhandene Containerzugriffe für Claude Code
- API Keys: `.env`, `.claude.config.json` im Container
- RAG Pipeline: Zugriff auf pgvector & embeddings vorhanden

✅ STARTE NUN DEN SYSTEMAUFBAU und gib nach jedem Block ein <done>, <refactor> oder <issue> zurück.

Built with ❤️ for AI developers by the ClaudeOSaar team
🤖 Powered by Claude Code