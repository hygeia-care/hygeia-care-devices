FROM node:20-alpine

ENV DB_URL="mongodb+srv://medDevService:lHFPV6sI94nny2cD@medicaldevicescluster.h2blqct.mongodb.net/?retryWrites=true&w=majority"

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY bin/ ./bin
COPY public/ ./public
COPY routes/ ./routes
COPY services/ ./services
COPY models/ ./models
COPY app.js .
EXPOSE 3000

CMD npm start
