FROM node:15

WORKDIR /app

COPY . .

RUN npm i --production

CMD npm start