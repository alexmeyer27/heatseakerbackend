# Use the official Node.js image
FROM node:18-bullseye-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN yarn run build

# Expose the port that the application will use
EXPOSE 8080

# Command to run the app
CMD ["node", "dist/index.js"]