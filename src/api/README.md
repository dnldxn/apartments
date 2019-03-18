# API

## Run Locally

```bash
# Run in separate window to hot reload the frontend
NODE_ENV=development parcel watch public/index.html

# Setup Proxy to Remote Mongo DB (if needed)
kubectl port-forward db-mongodb-primary-0 27017:27017

# Start server
npm install -g nodemon # only run once
nodemon server.js
```

## Build Docker Image Locally

```bash
# Build Image
docker build -t us.gcr.io/apartments-139902/apartments-api .

# Run Image Locally
docker run --name api -it -p 5000:5000 us.gcr.io/apartments-139902/apartments-api

# Push to Google Registry
docker push us.gcr.io/apartments-139902/apartments-api
gcloud container images list-tags

# Clean up stored images to avoid recurring charges
gcloud container images delete us.gcr.io/apartments-139902/apartments-api --force-delete-tags
```

## Build on Google Build Engine

```bash
gcloud builds submit --tag us.gcr.io/apartments-139902/apartments-api .

# Clean up stored images to avoid recurring charges
gcloud container images delete us.gcr.io/apartments-139902/apartments-api --force-delete-tags
```
