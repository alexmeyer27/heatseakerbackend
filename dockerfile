# Step 1: Use an official Node.js runtime as the base image
FROM node:18-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install production dependencies
RUN yarn install --production

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the TypeScript files
RUN yarn run build

# Step 7: Expose the port your app runs on
EXPOSE 3000

# Step 8: Command to run the application
CMD ["node", "dist/index.js"]