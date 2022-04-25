FROM node:12-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install

ADD ./src/ /usr/src/app

EXPOSE 5000

CMD ["node", "server.js"]
