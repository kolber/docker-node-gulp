FROM node

RUN mkdir /temp
WORKDIR /temp
CMD ["npm", "run", "build"]

COPY package.json /temp
RUN npm install

COPY . /temp
