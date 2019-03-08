FROM node:11-alpine

ENV NODE_ENV production
EXPOSE 5000

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN npm install --no-optional && npm cache clean --force

# Bundle app source
COPY server.js ./
COPY public ./public

CMD [ "node", "server.js" ]
