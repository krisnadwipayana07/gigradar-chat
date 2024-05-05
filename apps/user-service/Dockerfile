FROM node:20

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .
COPY .env /app

EXPOSE 3020

CMD ["npm", "start"]