FROM node:20-alpine

# Installing libvips-dev for sharp compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git

# Set environment variable
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set the working directory
WORKDIR /opt/

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn global add node-gyp
RUN yarn config set network-timeout 600000 -g && yarn install --production

# Add node_modules/.bin to $PATH
ENV PATH /opt/node_modules/.bin:$PATH

# Copy the rest of the application code
WORKDIR /opt/app
COPY . .

# Change ownership to the node user
RUN chown -R node:node /opt/app

# Switch to the node user
USER node

# Build the application
RUN yarn build

# Expose the Strapi port
EXPOSE 1337

# Start the application
CMD ["yarn", "start"]
