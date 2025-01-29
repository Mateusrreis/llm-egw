FROM node:20-alpine3.19


WORKDIR /app

EXPOSE 8080
EXPOSE 3000

COPY . .

RUN npm install

RUN npm run build

#TODO: Run command productions
CMD [ "npm","run","start:dev" ] 




