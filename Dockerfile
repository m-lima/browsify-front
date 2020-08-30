FROM node as web

WORKDIR /web

COPY package.json /web
COPY package-lock.json /web
RUN npm install

COPY . /web

# Build
RUN npm run build

# Pack
FROM alpine
COPY --from=web /web/build /web/build
