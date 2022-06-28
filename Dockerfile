FROM node:16-alpine

ARG LOG_FILE_PATH

COPY $LOG_FILE_PATH /logs/test.access.log
COPY package.json package-lock.json src/* /app/

WORKDIR /app

RUN npm install

CMD ["npm", "start", "/logs/test.access.log"]
