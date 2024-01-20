FROM node:20-alpine

# ENV GOOGLE_HEALTHCARE_API_AUTH=<fill in>

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY bin/ ./bin
COPY public/ ./public
COPY routes/ ./routes
# COPY services/ ./services
COPY models/ ./models
COPY app.js .
COPY verifyJWTToken.js .
COPY .env .
EXPOSE $MD_APP_PORT

CMD npm start
