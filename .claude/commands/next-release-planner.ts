#!/usr/bin/env tsx

// ClaudeOSaar Next Release Planner
// Generates release plans based on current progress

import * as fs from 'fs/promises';
import * as path from 'path';

interface ReleaseTask {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: 'xs' | 's' | 'm' | 'l' | 'xl';
  status: 'todo' | 'in-progress' | 'done';
  dependencies?: string[];
}

interface ReleasePlan {
  version: string;
  name: string;
  targetDate: string;
  tasks: ReleaseTask[];
  summary: string;
}

class ReleaseManager {
  private readonly memoryBankPath = '../../ai_docs/memory-bank';
  
  async getCurrentVersion(): Promise<string> {
    const packageJson = await fs.readFile('../../package.json', 'utf-8');
    const pkg = JSON.parse(packageJson);
    return pkg.version;
  }
  
  async loadProgress(): Promise<any> {
    try {
      const progressPath = path.join(this.memoryBankPath, 'progress.md');
      const content = await fs.readFile(progressPath, 'utf-8');
      return this.parseProgress(content);
    } catch (error) {
      return { completedTasks: [], inProgressTasks: [], pendingTasks: [] };
    }
  }
  
  private parseProgress(content: string): any {
    // Parse markdown progress file
    const sections = content.split('##').filter(Boolean);
    const progress = {
      completedTasks: [],
      inProgressTasks: [],
      pendingTasks: []
    };
    
    sections.forEach(section => {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      
      if (title.includes('Completed')) {
        progress.completedTasks = this.extractTasks(lines.slice(1));
      } else if (title.includes('In Progress')) {
        progress.inProgressTasks = this.extractTasks(lines.slice(1));
      } else if (title.includes('Pending')) {
        progress.pendingTasks = this.extractTasks(lines.slice(1));
      }
    });
    
    return progress;
  }
  
  private extractTasks(lines: string[]): string[] {
    return lines
      .filter(line => line.startsWith('-') || line.startsWith('*'))
      .map(line => line.substring(1).trim());
  }
  
  async generateNextRelease(): Promise<ReleasePlan> {
    const currentVersion = await this.getCurrentVersion();
    const progress = await this.loadProgress();
    
    // Calculate next version (semantic versioning)
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    const nextVersion = `${major}.${minor}.${patch + 1}`;
    
    // Generate tasks based on current progress
    const tasks: ReleaseTask[] = [
      {
        id: 'mcp-integration',
        title: 'Complete MCP Server Integration',
        description: 'Finish Model Context Protocol server setup',
        priority: 'critical',
        effort: 'l',
        status: progress.inProgressTasks.some(t => t.includes('MCP')) ? 'in-progress' : 'todo'
      },
      {
        id: 'cli-commands',
        title: 'Implement Core CLI Commands',
        description: 'Create essential CLI commands for workspace management',
        priority: 'high',
        effort: 'm',
        status: 'todo',
        dependencies: ['mcp-integration']
      },
      {
        id: 'auth-flow',
        title: 'Complete Authentication Flow',
        description: 'Implement OIDC and API key authentication',
        priority: 'critical',
        effort: 'l',
        status: progress.inProgressTasks.some(t => t.includes('Auth')) ? 'in-progress' : 'todo'
      },
      {
        id: 'billing-integration',
        title: 'Stripe Billing Integration',
        description: 'Implement subscription management with Stripe',
        priority: 'high',
        effort: 'xl',
        status: 'todo',
        dependencies: ['auth-flow']
      },
      {
        id: 'websocket-realtime',
        title: 'WebSocket Real-time Communication',
        description: 'Implement real-time updates for workspace events',
        priority: 'medium',
        effort: 'm',
        status: 'todo'
      },
      {
        id: 'memory-bank-api',
        title: 'Memory Bank REST API',
        description: 'Create endpoints for context storage and retrieval',
        priority: 'high',
        effort: 'm',
        status: 'todo'
      },
      {
        id: 'container-security',
        title: 'Security Hardening',
        description: 'Apply AppArmor profiles and security best practices',
        priority: 'critical',
        effort: 'm',
        status: progress.completedTasks.some(t => t.includes('Security')) ? 'done' : 'in-progress'
      }
    ];
    
    return {
      version: nextVersion,
      name: 'Foundation Release',
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tasks: tasks,
      summary: `Release ${nextVersion} focuses on completing core infrastructure for the ClaudeOSaar MVP, including MCP integration, authentication, and basic workspace management.`
    };
  }
  
  async saveReleasePlan(plan: ReleasePlan): Promise<void> {
    const releasePath = path.join(this.memoryBankPath, `release-${plan.version}.md`);
    
    const content = `# ClaudeOSaar Release ${plan.version} - ${plan.name}

## Target Date: ${plan.targetDate}

${plan.summary}

## Tasks

${plan.tasks.map(task => `
### ${task.title} [${task.priority.toUpperCase()}]

- **ID**: ${task.id}
- **Status**: ${task.status}
- **Effort**: ${task.effort.toUpperCase()}
- **Description**: ${task.description}
${task.dependencies ? `- **Dependencies**: ${task.dependencies.join(', ')}` : ''}
`).join('\n')}

## Release Checklist

- [ ] All critical tasks completed
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Release notes prepared
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Docker images built and pushed
- [ ] Deployment scripts tested
`;
    
    await fs.writeFile(releasePath, content, 'utf-8');
    console.log(`Release plan saved to: ${releasePath}`);
  }
  
  async updateProgress(plan: ReleasePlan): Promise<void> {
    const progressPath = path.join(this.memoryBankPath, 'progress.md');
    
    const content = `# ClaudeOSaar Development Progress

*Last Updated: ${new Date().toISOString()}*

## Current Version: ${await this.getCurrentVersion()}
## Next Release: ${plan.version} (${plan.targetDate})

## Completed Tasks

${plan.tasks.filter(t => t.status === 'done').map(t => `- ${t.title}`).join('\n')}

## In Progress

${plan.tasks.filter(t => t.status === 'in-progress').map(t => `- ${t.title} (${t.effort.toUpperCase()}, ${t.priority})`).join('\n')}

## Pending

${plan.tasks.filter(t => t.status === 'todo').map(t => `- ${t.title} (${t.effort.toUpperCase()}, ${t.priority})`).join('\n')}

## Key Milestones

- [${plan.tasks.filter(t => t.status === 'done').length > 0 ? 'x' : ' '}] Core infrastructure setup
- [ ] MCP server integration
- [ ] Authentication system
- [ ] Billing integration
- [ ] WebSocket real-time updates
- [ ] Memory Bank API
- [ ] Security hardening
- [ ] MVP launch ready
`;
    
    await fs.writeFile(progressPath, content, 'utf-8');
    console.log(`Progress updated at: ${progressPath}`);
  }
}

// Main execution
async function main() {
  const manager = new ReleaseManager();
  
  try {
    console.log('🚀 ClaudeOSaar Release Planner');
    console.log('============================\n');
    
    const plan = await manager.generateNextRelease();
    
    console.log(`Next Release: v${plan.version} - ${plan.name}`);
    console.log(`Target Date: ${plan.targetDate}`);
    console.log(`\nTasks (${plan.tasks.length} total):`);
    
    plan.tasks.forEach(task => {
      const statusIcon = task.status === 'done' ? '✅' : 
                        task.status === 'in-progress' ? '🔄' : '⏰';
      console.log(`${statusIcon} [${task.priority}] ${task.title} (${task.effort})`);
    });
    
    console.log('\nSaving release plan...');
    await manager.saveReleasePlan(plan);
    
    console.log('Updating progress tracker...');
    await manager.updateProgress(plan);
    
    console.log('\n✨ Release planning complete!');
    
  } catch (error) {
    console.error('Error generating release plan:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { ReleaseManager, ReleasePlan, ReleaseTask };
