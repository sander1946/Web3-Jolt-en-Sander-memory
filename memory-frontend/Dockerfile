FROM node:22.12-alpine

EXPOSE 8080

WORKDIR /app

# Copy package files for dependency installation
COPY ./ /app/

# remove existing node_modules and lock files to ensure a clean install
RUN rm -f -r /app/node_modules
RUN rm -f /app/package-lock.json
RUN rm -f /app/bun.lock

RUN npm install -g bun

RUN npm install -g typescript

RUN npm install -g http-server

RUN npm install

RUN bun install

RUN tsc

CMD ["http-server", "./public", "-p", "8080", "-a", "0.0.0.0"] 