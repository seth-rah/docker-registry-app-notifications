FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY * ./

RUN npm install
run npm audit fix

EXPOSE 8080
EXPOSE 1337
CMD [ "node", "app.js" ]
