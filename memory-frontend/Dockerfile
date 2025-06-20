FROM node:22.12-alpine

EXPOSE 8080

WORKDIR /app

# Copy package files for dependency installation
COPY ./ /app/

RUN npm install -g bun

RUN npm install -g typescript

RUN npm install -g http-server

RUN bun install

RUN tsc

CMD ["http-server", "./public", "-p", "8080", "-a", "0.0.0.0"] 