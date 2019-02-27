# API


## Build Locally

```bash
docker build -t apartments-api .

docker run --name api -d -p 5000:5000 apartments-api

# Configure docker to use the gcloud command-line tool as a credential helper
gcloud auth configure-docker

# Tag image with registry name
docker tag apartments-api us.gcr.io/apartments-139902/apartments-api
docker push us.gcr.io/apartments-139902/apartments-api
gcloud container images list-tags

# Clean up stored images to avoid recurring charges
gcloud container images delete us.gcr.io/apartments-139902/apartments-api --force-delete-tags
```

## Debug with remote MongoDB

```bash
kubectl port-forward db-mongodb-primary-0 27017:27017
```

## Build on Google Build Engine

```bash
gcloud builds submit --tag us.gcr.io/apartments-139902/apartments-api .

# Clean up stored images to avoid recurring charges
gcloud container images delete us.gcr.io/apartments-139902/apartments-api --force-delete-tags
```


## Deploy Image on k8s

https://medium.com/@awkwardferny/getting-started-with-kubernetes-ingress-nginx-on-minikube-d75e58f52b6c

```bash
kubectl apply -f deployment.yml
```
