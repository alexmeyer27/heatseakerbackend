# Use the official Node.js image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Globally install TypeScript and required build tools
RUN yarn global add typescript tsc-alias

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN yarn run build

# Expose the port that the application will use
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/index.js"]