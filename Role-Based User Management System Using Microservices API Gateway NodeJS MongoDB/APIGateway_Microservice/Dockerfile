FROM node:24-alpine
WORKDIR /app2
COPY package*.json ./
RUN npm install
COPY . /app2
EXPOSE 4000
CMD node index.js