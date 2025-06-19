FROM node:22.12-alpine

EXPOSE 4200

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

CMD ["sh", "-c", "ng serve --host 0.0.0.0 --port 4200"]
