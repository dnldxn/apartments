#!/bin/sh

if [ -z "$CLUSTER_NAME" ] || [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_DATABASE" ] || [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ]; then
  echo 'one or more variables are undefined'
  exit 1
fi

echo "Authenticating to Google Cloud"
gcloud auth activate-service-account --key-file=apartments-139902-key.json

gcloud config set project apartments-139902
gcloud config set compute/zone us-west1-a
gcloud config set container/cluster $CLUSTER_NAME

# Scale up the cluster
echo "Resizing the cluster up"
gcloud container clusters resize $CLUSTER_NAME --quiet --node-pool default-pool --size=3

# Setup kubectl
gcloud container clusters get-credentials $CLUSTER_NAME

# Wait 30 seconds for the cluster to stabalize
echo "Waiting for Mongo to be deployed"
sleep 30s

# Check Mongo is running
#echo 'db.runCommand("ping").ok' | mongo localhost:27017/test --quiet

# Run scrappers
kubectl run apartments-scrapper-verge --image=us.gcr.io/apartments-139902/apartments-scrapper \
    -it --rm \
    --env="DB_HOST=${DB_HOST}" --env="DB_PORT=${DB_PORT}" \
    --env="DB_DATABASE=${DB_DATABASE}" --env="DB_USERNAME=${DB_USERNAME}" \
    --env="DB_PASSWORD=${DB_PASSWORD}" \
    -- the_verge.py

kubectl run apartments-scrapper-ava --image=us.gcr.io/apartments-139902/apartments-scrapper \
    -it --rm \
    --env="DB_HOST=${DB_HOST}" --env="DB_PORT=${DB_PORT}" \
    --env="DB_DATABASE=${DB_DATABASE}" --env="DB_USERNAME=${DB_USERNAME}" \
    --env="DB_PASSWORD=${DB_PASSWORD}" \
    -- ava_pacific_beach.py

# Scale down the cluster
echo "Resizing the cluster down"
gcloud container clusters resize --quiet --node-pool default-pool --size=0
