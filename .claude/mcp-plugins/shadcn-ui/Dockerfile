FROM node:18-alpine

WORKDIR /app

# Install Express and CORS
RUN npm init -y && \
    npm install express cors

# Copy our simple server implementation
COPY server.js .

EXPOSE 8080

# Run the simple Express server
CMD ["node", "server.js"]