FROM node

RUN mkdir /temp
WORKDIR /temp
RUN npm install -g yarn
CMD ["npm", "run", "build"]

COPY package.json /temp
RUN yarn

COPY . /temp
