# ClaudeOSaar Dashboard UI Structure

## Overview

The ClaudeOSaar Dashboard UI is built using Next.js 15 with App Router and Tailwind CSS 4, providing a modern, responsive interface for managing AI workspaces, containers, and agents. The dashboard includes real-time monitoring, terminal access, and management capabilities.

## Component Architecture

The dashboard follows a modular component architecture with the following key components:

```
/src/ui/dashboard/
├── layout.tsx                   # Main layout with sidebar and header
├── page.tsx                     # Dashboard homepage
├── Sidebar.tsx                  # Navigation sidebar
├── Header.tsx                   # App header with user menu and actions
├── Shell.tsx                    # Container component for dashboard pages
├── styles/
│   └── index.css                # Tailwind CSS configuration and theme variables
├── components/
│   └── widgets/                 # Reusable dashboard widgets
│       ├── TerminalPanel.tsx    # Interactive terminal with xterm.js
│       ├── AgentStatusCard.tsx  # Agent status display card
│       ├── MetricsStream.tsx    # Real-time metrics visualization
│       └── LogStream.tsx        # Log viewer with filtering
└── socket/                      # WebSocket connection utilities
    ├── WebSocketService.ts      # WebSocket client service
    ├── hooks.ts                 # React hooks for WebSocket connections
    └── interfaces.ts            # TypeScript interfaces for WebSocket data
```

## Key Features

### 1. Real-Time Terminal Access

- Uses XTerm.js for terminal emulation
- WebSocket connection to container shell
- UTF-8 encoding with full ANSI color support
- Terminal resizing and fullscreen mode
- History and command completion

### 2. Live Metrics Visualization

- CPU, memory, disk, and network metrics
- Real-time updating charts with Recharts
- Configurable time windows (1h, 3h, 12h, 24h)
- Filterable metrics display
- Threshold visualization for resource limits

### 3. Agent Status Monitoring

- Visual status indicators for agents
- Resource usage tracking
- Start/stop/restart functionality
- Terminal access shortcut
- Last activity tracking

### 4. Log Streaming

- Real-time container and system logs
- Level-based filtering (info, warn, error, debug)
- Text-based search
- Auto-scroll with pause functionality
- Timestamp and source display

### 5. Workspace Management

- Workspace creation and configuration
- Status overview
- Resource allocation visualization
- Container deployment controls
- Automatic reconnection

## Design System

### Theme Configuration

The dashboard uses Tailwind CSS 4 with CSS variables for theming, supporting:

- Light mode (default)
- Dark mode
- High-contrast mode
- Region-specific adjustments

### Color Palette

```
Primary:    #4f46e5 (Indigo)
Success:    #22c55e (Green)
Warning:    #f59e0b (Amber)
Error:      #ef4444 (Red)
Info:       #3b82f6 (Blue)
Background: #f8f9fa (Light) / #0f172a (Dark)
Card:       #ffffff (Light) / #1e293b (Dark)
Text:       #1e293b (Light) / #e2e8f0 (Dark)
```

### Responsive Design

- Mobile-first approach
- Collapsible sidebar
- Responsive grid layouts
- Touch-friendly controls
- Adaptive component sizing

## WebSocket Integration

The dashboard uses WebSockets for real-time communication:

1. **Terminal Sessions**
   - WebSocket path: `/api/ws/terminal/{container_id}?token={jwt_token}`
   - Bidirectional streaming for terminal I/O
   - Binary data support for byte streams

2. **Metrics Streaming**
   - WebSocket path: `/api/ws/metrics/{workspace_id}?token={jwt_token}`
   - JSON-formatted metrics updates
   - Configurable sampling rate (1-5 seconds)

3. **Log Streaming**
   - WebSocket path: `/api/ws/logs/{container_id}?token={jwt_token}`
   - Structured log entries with level, timestamp, and source
   - Server-side filtering options

4. **Event Notifications**
   - WebSocket path: `/api/ws/events/{workspace_id}?token={jwt_token}`
   - System events, state changes, and notifications
   - Workspace and user-specific channels

## Security Considerations

- JWT token-based authentication for WebSocket connections
- Rate limiting for message frequency
- Input sanitization for terminal commands
- Isolated connections per workspace
- Automatic session timeout

## Future Enhancements

- Collaborative workspace editing
- Shared terminal sessions
- Agent-to-agent communication visualization
- Advanced log analytics
- Custom dashboard widget layout
- Mobile app with push notifications

## Usage Examples

### Terminal Panel

```tsx
<TerminalPanel
  containerId="container-123"
  token="jwt-token-here"
  height="400px"
/>
```

### Metrics Stream

```tsx
<MetricsStream
  workspaceId="workspace-123"
  token="jwt-token-here"
/>
```

### Agent Status Card

```tsx
<AgentStatusCard
  id="agent-123"
  name="Development Workspace"
  status="active"
  type="claude-3-opus"
  lastActivity="2 minutes ago"
  resourceUsage={{ cpu: 43, memory: 38 }}
/>
```

### Log Stream

```tsx
<LogStream
  containerId="container-123"
  token="jwt-token-here"
  maxHeight="300px"
  autoScroll={true}
/>
```

## Implementation Notes

1. The dashboard uses React Server Components (RSC) where possible to reduce client-side JavaScript.
2. For interactive components like Terminal and Metrics visualizations, client-side rendering is used.
3. WebSocket connections are managed with custom hooks for easy integration.
4. Authentication state is shared between components through React Context.
5. Theme preferences are stored in localStorage and synced with system preferences.

## Testing Instructions

1. Start the development server:
   ```
   npm run dev
   ```

2. Open browser at `http://localhost:3000/dashboard`

3. Test WebSocket connections:
   - Create a workspace
   - Connect to terminal
   - Monitor real-time metrics
   - Check log streaming

4. Test responsiveness by resizing browser window

5. Test theme switching between light/dark modes