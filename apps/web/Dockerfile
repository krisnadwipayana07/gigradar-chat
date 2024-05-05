FROM node:14

WORKDIR /web

COPY . /web
COPY .env /web

RUN yarn

RUN export NODE_OPTIONS=--openssl-legacy-provider

CMD ["yarn", "start"]