import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')
  
  // Create demo user
  const password = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@claudeosaar.ai' },
    update: {},
    create: {
      email: 'demo@claudeosaar.ai',
      name: 'Demo User',
      passwordHash: password,
      apiKey: 'demo-api-key',
      subscriptionTier: 'pro',
    }
  })
  
  console.log({ user })
  
  // Create demo workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'AI Development Hub',
      description: 'Claude-powered development environment',
      tier: 'pro',
      status: 'stopped',
      userId: user.id,
      resources: {
        cpu: 2,
        memory: 4096, // 4GB in MB
        storage: 50 * 1024 * 1024 * 1024, // 50GB in bytes
      }
    }
  })
  
  console.log({ workspace })
  
  // Create demo memory bank entries
  const memoryBanks = await Promise.all([
    prisma.memoryBank.create({
      data: {
        key: 'project-overview',
        content: 'ClaudeOSaar is a sovereign AI development workspace OS with containerized environments.',
        metadata: { category: 'documentation' },
        workspaceId: workspace.id,
        userId: user.id,
      }
    }),
    prisma.memoryBank.create({
      data: {
        key: 'tech-stack',
        content: 'Built with Next.js, TypeScript, Docker, and integrated with Claude via MCP protocol.',
        metadata: { category: 'technical' },
        workspaceId: workspace.id,
        userId: user.id,
      }
    })
  ])
  
  console.log({ memoryBanks })
  
  // Create demo agent
  const agent = await prisma.agent.create({
    data: {
      name: 'Development Assistant',
      type: 'mcp',
      configuration: {
        tools: ['filesystem', 'terminal', 'memory-bank'],
        permissions: {
          readFiles: true,
          writeFiles: true,
          executeCommands: true,
        }
      },
      status: 'active',
      workspaceId: workspace.id,
    }
  })
  
  console.log({ agent })
  
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })