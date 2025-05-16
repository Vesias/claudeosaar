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

## Getting Started

> **Hinweis**: Dieser Code darf nur zu Ansichtszwecken verwendet werden. Eine Installation gemäß dieser Anleitung ist nur für autorisierte Benutzer erlaubt.

1. Clone the repository
```bash
git clone https://github.com/claudeosaar/claudeosaar.git
cd claudeosaar
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run development server
```bash
# Start API server
npm run dev

# Start UI development server (in a separate terminal)
npm run dev:ui
```

## Project Structure

```
.claude/                    # Claude workspace configuration
├── agents/                 # AI agent templates and configurations
├── commands/               # Custom Claude CLI commands
├── mcp-server/             # MCP server integration
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
```

## Plugin System

ClaudeOSaar features an extensible plugin system that allows developers to add new functionality:

1. **Core Plugin Types**:
   - Tool integrations (IDE, version control)
   - AI model extensions
   - Custom UI components
   - Workflow automation

2. **Plugin Structure**:
   ```
   plugins/my-plugin/
   ├── plugin.json           # Plugin metadata
   ├── index.js              # Plugin entry point
   └── ui/                   # Optional UI components
   ```

3. **Example Plugin API Usage**:
   ```typescript
   import { BasePlugin } from '../../src/plugins';
   
   export default class ExamplePlugin extends BasePlugin {
     meta = {
       id: 'example-plugin',
       name: 'Example Plugin',
       version: '1.0.0',
       // ...
     };
     
     async initialize() {
       // Plugin initialization logic
       this.api.registerCommand('example', async () => {
         // Command implementation
       });
     }
     
     async cleanup() {
       // Cleanup logic
     }
   }
   ```

## Subscription Tiers

- **Free**: 512MB RAM, 0.5 CPU, 5GB storage
- **Pro** ($21.99/mo): 2GB RAM, 2 CPU, 50GB storage
- **Enterprise**: 8GB RAM, 4 CPU, 100GB storage, multi-agent support

## License

MIT License - see LICENSE file for details

## Support

- Documentation: https://docs.claudeosaar.saarland
- Issues: https://github.com/claudeosaar/claudeosaar/issues
- Email: support@claudeosaar.saarland