FROM node:20-alpine

ENV DB_URL="mongodb+srv://medDevService:lHFPV6sI94nny2cD@medicaldevicescluster.h2blqct.mongodb.net/?retryWrites=true&w=majority"
ENV MD_APP_PORT=3334
# ENV GOOGLE_HEALTHCARE_API_AUTH=<fill in>
ENV USER_SERVICE_URL="http://localhost:3333/api/v1/auth/"
ENV USER_SERVICE_API_KEY="04f9237d-646e-4e0d-90d2-504b1f7dcbc0"

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
