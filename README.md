# Medical Devices Backend

This repo contains the code for running the microservice for medical devices in the context of the hygena app.

The "Medical Devices" microservice is responsible for the integration and management of medical devices. This microservice provides functionalities such as connecting medical devices to the platform, storing and processing data collected from these devices, and making this data available for use in diagnostics and treatment. It also facilitates interoperability between different devices and systems, ensuring that information is accessible and usable in an effective way for medical professionals.

## Running from a docker container

A docker image can be built from the exisitng docker file. Running the resulting image will run the medical devices on the port defined in the Dockerfile. 

The value for the environment variable must be set (see GOOGLE_HEALTHCARE_API_AUTH in the Dockerfile). Contact Danielle McKenney for this API key. 

This can be achieved in Visual Studio Code, or by running the following commands from the directory of the project:

```bash
docker build --pull --rm -f "Dockerfile" -t medicaldevices:latest "."

docker run -p <replace with MD_APP_PORT value>:<replace with MD_APP_PORT value> medicaldevices:latest

```

## Running Locally

The app can be started by running the following command and will run on port 3334 by default:

```bash
npm start
```
This will attempt a connection to a local database. To reach the mongodb database, define the environment variable

```bash
export DB_URL="mongodb+srv://medDevService:lHFPV6sI94nny2cD@medicaldevicescluster.h2blqct.mongodb.net/?retryWrites=true&w=majority"
```
The following API key must also be defined; contact Danielle McKenney for its value.

```bash
export GOOGLE_HEALTHCARE_API_AUTH=<contact Danielle for secret>
```

Optionally, the port to run the app on can be defined with the following environment variabl (default is 3334):

```bash
export MD_APP_PORT=3334
```

Also define the variables for connecting to the user service:
```bash
export USER_SERVICE_URL="http://localhost:3333/api/v1/auth/"
export USER_SERVICE_API_KEY="04f9237d-646e-4e0d-90d2-504b1f7dcbc0"
```

All together:
```bash
export DB_URL="mongodb+srv://medDevService:lHFPV6sI94nny2cD@medicaldevicescluster.h2blqct.mongodb.net/?retryWrites=true&w=majority"
export GOOGLE_HEALTHCARE_API_AUTH=<contact Danielle for secret>
export MD_APP_PORT=3334
export USER_SERVICE_URL="http://localhost:3333/api/v1/auth/"
export USER_SERVICE_API_KEY="04f9237d-646e-4e0d-90d2-504b1f7dcbc0"
```

## Usage

The app supports two resources, "analysis" and "measurements". See below for examples of the supported requests. All requests require a valid api key and token as demonstrated in the first example:

```bash
# get specific analysis by id
curl --location 'http://localhost:3334/api/v1/analysis/<id>' \
--header 'x-auth-token: <valid_token>' \
--header 'Authorization: Bearer <API_key>'
# get all analysis
curl --location 'http://localhost:3000/api/v1/analysis'
# filtered get analysis
curl --location 'http://localhost:3000/api/v1/analysis?userId=xxx'
# delete analysis
curl --location --request DELETE 'http://localhost:3000/api/v1/analysis/659966eea30e7700627e5e1a'
# post analysis
curl --location 'http://localhost:3000/api/v1/analysis' \
--header 'Content-Type: application/json' \
--data '{ "measurement": "659a89130ea326c42db23007", "value":"newVal2"}'

# get all measurement
curl --location 'http://localhost:3000/api/v1/measurement'
# post measurement
curl --location 'http://localhost:3000/api/v1/measurement' \
--header 'Content-Type: application/json' \
--data '{"title":"myTitle", "date": "2019-04-28T14:45:15", "comment": "cmt", "type": "bloodPressure", "user": "123a"}'
s
# patch measurement
curl --location --request PATCH 'http://localhost:3000/api/v1/measurement/659a89130ea326c42db23007' \
--header 'Content-Type: application/json' \
--data '{
    "title": "New Title",
    "date": "2023-04-28T14:45:15",
    "comment": "2NEW comment",
    "user": "xxx"
}'
```
