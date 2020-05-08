FROM node:10-alpine

EXPOSE 3000
WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm install --no-audit --progress=false


COPY . .

CMD npm run start
