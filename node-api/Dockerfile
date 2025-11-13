FROM node:lts AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# run the repo's build step (build.mjs) which emits /dist
RUN npm run build

FROM node:lts
WORKDIR /usr/src/app
COPY --from=build /usr/src/app ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
