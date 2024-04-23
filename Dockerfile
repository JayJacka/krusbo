FROM node:20-alpine AS dep 

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM node:20-alpine

WORKDIR /app

COPY --from=dep /app/node_modules /app/node_modules

COPY . .

CMD ["npm", "postinstall"]

CMD ["npm", "run", "db:push"]

CMD ["npm", "start"]
