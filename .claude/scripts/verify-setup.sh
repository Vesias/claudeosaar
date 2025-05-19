#!/bin/bash

# ClaudeOSaar Setup Verification Script

echo "🔍 Verifying ClaudeOSaar Setup..."
echo "================================"

# Check directory structure
echo "\n📁 Checking directory structure:"
dirs=(
  ".claude/agents"
  ".claude/commands"
  ".claude/mcp-server"
  ".claude/profiles"
  ".claude/projekts"
  ".claude/prompt-enhancer"
  ".claude/researches"
  ".claude/scripts"
  ".claude/store"
  ".claude/vibe-coding"
  "ai_docs/memory-bank"
  "src/api"
  "src/components"
  "src/pages"
  "containers"
)

for dir in "${dirs[@]}"; do
  if [ -d "$dir" ]; then
    echo "✅ $dir"
  else
    echo "❌ $dir (missing)"
  fi
done

# Check configuration files
echo "\n📄 Checking configuration files:"
files=(
  "package.json"
  "CLAUDE.md"
  ".claude/.clauderules"
  ".claude/.claudeignore"
  ".claude/mcp-server/config.json"
  ".claude/agents/web-developer.json"
  ".claude/agents/backend-engineer.json"
  ".claude/prompt-enhancer/config.json"
  ".claude/scripts/start-container.sh"
  ".claude/commands/next-release-planner.ts"
  "ai_docs/memory-bank/progress.md"
  "containers/docker-compose.yaml"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (missing)"
  fi
done

# Check executable permissions
echo "\n🔐 Checking executable permissions:"
executables=(
  ".claude/scripts/start-container.sh"
  ".claude/commands/next-release-planner.ts"
)

for exec in "${executables[@]}"; do
  if [ -x "$exec" ]; then
    echo "✅ $exec"
  else
    echo "❌ $exec (not executable)"
  fi
done

# Check git status
echo "\n🌿 Git status:"
git status --short

# Version check
echo "\n📦 Current version:"
grep '"version"' package.json | head -1

echo "\n✨ Setup verification complete!"
