FROM node:24-alpine
WORKDIR /app3
COPY package*.json ./
RUN npm install
COPY . /app3
EXPOSE 5002
CMD node index.js