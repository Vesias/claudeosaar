# ClaudeOSaar - AI Development Workspace OS

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0+-black)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

ClaudeOSaar is a sovereign AI development workspace OS that provides containerized development environments with native Claude CLI integration. Available at [agentland.saarland](https://agentland.saarland).

## 🚀 Features

- **Containerized Workspaces**: Isolated Docker-based environments for secure development
- **Claude Integration**: Native Claude CLI with Model Context Protocol (MCP) support
- **Memory Bank**: Persistent context storage and retrieval system
- **Multi-tenant Architecture**: User isolation with resource limits based on subscription tiers
- **Enterprise Security**: AppArmor profiles, JWT authentication, and container isolation
- **Cloud Native**: Kubernetes-ready with horizontal scaling and load balancing

## 📋 Prerequisites

- Node.js >= 18.0.0
- Docker >= 24.0.0
- npm >= 9.0.0
- PostgreSQL >= 15.0
- Redis >= 7.0

## 🛠️ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/claudeosaar.git
cd claudeosaar
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start development servers

```bash
# Start all services
npm run dev:all

# Or start individually
npm run dev        # API server (port 6600)
npm run dev:ui     # Next.js UI (port 6601)
npm run dev:mcp    # MCP server (port 6602)
```

### 5. Access the application

- UI: http://localhost:6601
- API: http://localhost:6600
- MCP: http://localhost:6602

## 📦 Docker Deployment

### Development with Docker Compose

```bash
# Build containers
npm run docker:build

# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Production Deployment

```bash
# Build production images
docker build -t claudeosaar/api -f containers/Dockerfile.api .
docker build -t claudeosaar/ui -f containers/Dockerfile.ui .

# Deploy with Kubernetes
kubectl apply -f k8s/
```

## 📚 Documentation

### Architecture

```
src/
├── api/                 # Backend API (Node.js/Express + Python/FastAPI)
├── components/          # React components
├── containers/          # Container management
├── context/            # React context providers
├── pages/              # Next.js pages
├── types/              # TypeScript type definitions
├── ui/                 # UI components and pages
└── utils/              # Utility functions
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/register` | POST | User registration |
| `/api/workspaces` | GET | List user workspaces |
| `/api/workspaces` | POST | Create new workspace |
| `/api/workspaces/:id` | GET | Get workspace details |
| `/api/workspaces/:id` | PATCH | Update workspace |
| `/api/workspaces/:id` | DELETE | Delete workspace |
| `/api/memory-bank/store` | POST | Store context |
| `/api/memory-bank/retrieve` | GET | Retrieve context |

### Subscription Tiers

| Tier | Price | Resources | Features |
|------|-------|-----------|----------|
| Free | €0/mo | 512MB RAM, 0.5 CPU, 5GB storage | 1 workspace, Basic MCP tools |
| Pro | €13.99/mo | 2GB RAM, 2 CPU, 50GB storage | 5 workspaces, Advanced tools |
| Enterprise | €21.99/mo | 8GB RAM, 4 CPU, 100GB storage | Unlimited workspaces, Multi-agent |

## 🧪 Testing

### Run tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Code quality

```bash
# Linting
npm run lint

# Type checking
npm run typecheck

# Format code
npm run format

# Security audit
npm run security:audit
```

## 🔐 Security

### Best Practices

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control (RBAC)
3. **Input Validation**: Zod schemas for all inputs
4. **Rate Limiting**: API endpoint protection
5. **Container Security**: AppArmor profiles and resource limits
6. **Secrets Management**: Environment variables and secure storage

### Security Scanning

```bash
# Dependency audit
npm audit

# Security scan
npm run security:scan
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write comprehensive tests
- Add JSDoc comments
- Follow ESLint rules
- Ensure accessibility (WCAG 2.1 AA)

## 📈 Performance

### Optimization Strategies

1. **Code Splitting**: Dynamic imports for large components
2. **Memoization**: React.memo and useMemo for expensive operations
3. **Lazy Loading**: Images and components
4. **Caching**: Redis for API responses
5. **CDN**: Static assets delivery

### Monitoring

- Prometheus metrics at `/metrics`
- Grafana dashboards for visualization
- Error tracking with Sentry (production)

## 🐛 Troubleshooting

### Common Issues

1. **Docker connection errors**
   ```bash
   # Restart Docker daemon
   sudo systemctl restart docker
   ```

2. **Port conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :6600
   ```

3. **Database migrations**
   ```bash
   # Run migrations
   npm run db:migrate
   ```

## 📝 License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- Documentation: [docs.claudeosaar.com](https://docs.claudeosaar.com)
- Issues: [GitHub Issues](https://github.com/yourusername/claudeosaar/issues)
- Email: support@agentland.saarland

## 🙏 Acknowledgments

- Claude AI by Anthropic
- Docker for containerization
- Next.js for the frontend framework
- TypeScript for type safety
- The open-source community

---

Built with ❤️ by the ClaudeOSaar Team in Saarland