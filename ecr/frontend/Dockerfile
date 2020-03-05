FROM node:slim

WORKDIR /src

COPY ./package.json /src

RUN npm install

COPY ./index.js /src

CMD ["npm","start"]
