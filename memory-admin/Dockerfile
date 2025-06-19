FROM node:22.12-alpine

EXPOSE 4200

WORKDIR /app

COPY ./ /app/

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
