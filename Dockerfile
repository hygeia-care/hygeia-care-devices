FROM node:20-alpine

ENV DB_URL="mongodb+srv://medDevService:lHFPV6sI94nny2cD@medicaldevicescluster.h2blqct.mongodb.net/?retryWrites=true&w=majority"
ENV MD_APP_PORT=3334
# ENV GOOGLE_HEALTHCARE_API_AUTH=<fill in>

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
EXPOSE $MD_APP_PORT

CMD npm start
