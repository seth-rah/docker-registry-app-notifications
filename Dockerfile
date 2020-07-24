FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/notifier

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied

COPY notifier.js ./
COPY templates.js ./
COPY package.json ./
COPY package-lock.json ./
COPY interface ./interface

RUN npm install

EXPOSE 1337

CMD [ "node", "notifier.js" ]
