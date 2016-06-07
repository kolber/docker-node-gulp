FROM node

RUN mkdir /temp

WORKDIR /temp
ADD package.json /temp/package.json
ADD gulpfile.babel.js /temp/gulpfile.babel.js
ADD .babelrc /temp/.babelrc
ADD webpack.config.babel.js /temp/webpack.config.babel.js
ADD $ASSET_INPUT_DIR /temp/${ASSET_INPUT_DIR}
RUN npm install

CMD ["npm", "run", "build"]
