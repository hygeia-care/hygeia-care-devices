#!/bin/bash
# This script updates the google auth token every hour and exports it
# to the local and docker environment variables
# Ensure that the google cloud SDK is installed to run this script
# To make this file executable run chmod +x googleAPITokenFetch.sh
# To make this run every hour run create a cronjob (via crontab -e)
# 0 * * * * <path>/googleAPITokenFetch.sh

# Run the gcloud command and capture the result
ACCESS_TOKEN=$(/Users/daniellemckenney/Programming/erasmusCourses/FIS_Projects/google-cloud-sdk/bin/gcloud auth application-default print-access-token)

export GOOGLE_HEALTHCARE_API_AUTH=$ACCESS_TOKEN
# Set the environment variable in the Docker container
# NOTE: modest_kapitsa needs to be replaced with the name of the docker container
docker exec -e ACCESS_TOKEN="$ACCESS_TOKEN" modest_kapitsa sh -c 'export GOOGLE_HEALTHCARE_API_AUTH="$ACCESS_TOKEN"'

# Optionally, you can print the result
echo "GOOGLE_HEALTHCARE_API_AUTH reset in docker container and locally"
