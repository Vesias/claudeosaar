const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'shadcn-ui-mcp' });
});

// Placeholder endpoints for shadcn-ui MCP
app.post('/getComponent', (req, res) => {
  res.json({ 
    status: 'success', 
    data: {
      component: 'Button',
      code: 'export function Button({ children, className, ...props }) {\n  return (\n    <button className={className} {...props}>\n      {children}\n    </button>\n  );\n}',
      message: 'Component retrieved successfully'
    }
  });
});

app.post('/getComponentDemo', (req, res) => {
  res.json({ 
    status: 'success', 
    data: {
      demo: '<Button>Click me</Button>',
      message: 'Component demo retrieved successfully'
    }
  });
});

app.post('/getInstallScript', (req, res) => {
  res.json({ 
    status: 'success', 
    data: {
      script: 'npx shadcn-ui add button',
      message: 'Install script retrieved successfully'
    }
  });
});

app.post('/getFrameworkGuide', (req, res) => {
  res.json({ 
    status: 'success', 
    data: {
      guide: '# Installation Guide\n\n1. Run `npx shadcn-ui init`\n2. Select your preferred framework\n3. Run `npx shadcn-ui add button`',
      message: 'Framework guide retrieved successfully'
    }
  });
});

app.listen(port, () => {
  console.log(`Shadcn UI MCP server running at http://localhost:${port}`);
});