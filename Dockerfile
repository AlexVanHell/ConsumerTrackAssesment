FROM node:16-alpine

COPY package.json package-lock.json src/* ./app/

WORKDIR /app

RUN npm install

CMD ["npm", "start"]
