FROM node:12
EXPOSE 3000 9229

RUN npm install pm2 -g

WORKDIR /home/app

COPY package.json /home/app/
COPY yarn.lock /home/app/

RUN yarn install --frozen-lockfile

COPY . /home/app

RUN yarn build
