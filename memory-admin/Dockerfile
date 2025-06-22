FROM node:22.12-alpine

EXPOSE 4200

WORKDIR /app

# Copy package files for dependency installation
COPY ./ /app/

# remove existing node_modules and lock files to ensure a clean install
RUN rm -f -r /app/node_modules
RUN rm -f /app/package-lock.json

RUN npm install -g @angular/cli

RUN npm install

CMD ["sh", "-c", "ng serve --host 0.0.0.0 --port 4200"]
