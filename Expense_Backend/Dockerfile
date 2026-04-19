# Use a lighter version of Node
FROM node:20-alpine

# Install Tini for proper signal handling
RUN apk add --no-cache tini

# Set working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies (production only for the final image)
RUN npm ci --only=production

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs && chown -R node:node logs

# Use non-root user for security
USER node

# Expose the application port
EXPOSE 8000

# Use Tini as the entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "src/index.js"]
