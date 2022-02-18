#Docker file to start the docker image

#select os
FROM ubuntu:18.04

#copy the files to the docker image
WORKDIR /usr/app
COPY ./ /usr/app

#install packages
RUN apt-get update
RUN apt-get install -y curl

#install nvm
ENV NODE_VERSION=16.14.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

RUN apt-get install -y npm
RUN npm install -g npm

#install discord.js dependencies
RUN npm install

#install pm2
RUN npm install pm2 -g


#deploy commands
RUN [ "node", "deploy-commands.js" ]

#start bot with pm2
CMD ["pm2-runtime", "bot.js"]


