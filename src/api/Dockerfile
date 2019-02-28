FROM node:8-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY server.js ./
COPY public ./public

EXPOSE 5000
CMD [ "node", "server.js" ]