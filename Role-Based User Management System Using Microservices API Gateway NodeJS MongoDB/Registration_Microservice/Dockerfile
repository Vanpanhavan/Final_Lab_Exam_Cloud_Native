FROM node:24-alpine
WORKDIR /app5
COPY package*.json ./
RUN npm install
COPY . /app5
EXPOSE 5001
CMD node index.js