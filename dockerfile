# Use the official Node.js image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json or yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port that the application will use
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/index.js"]