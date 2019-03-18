FROM node:11-alpine as base


# Build Frontend
FROM base as frontend-builder

RUN npm install -g parcel-bundler

WORKDIR /app
COPY ./public ./

RUN npm install --no-optional
RUN parcel build index.html --no-source-maps


# Build Final Image
FROM base

# Create app directory
WORKDIR /app

# Copy compiled frontend files
COPY --from=frontend-builder /app/dist ./dist

ENV NODE_ENV production
EXPOSE 5000

# Install app dependencies
COPY package.json ./
RUN npm install --no-optional && npm cache clean --force && rm package-lock.json

# Bundle app source
COPY server.js ./

CMD [ "node", "server.js" ]
