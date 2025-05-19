FROM node:18-alpine

WORKDIR /app

# Clone the shadcn-ui-mcp-unofficial repository
RUN apk add --no-cache git
RUN git clone https://github.com/Jpisnice/shadcn-ui-mcp-unofficial.git .

# Install dependencies
RUN npm install

# Build the TypeScript server
RUN npm run build

EXPOSE 8080

# Run the server in HTTP/SSE mode
CMD ["node", "dist/http-server.js"]