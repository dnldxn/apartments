# Apartments

## TODO

- Get MongoDB working on k8s locally
- Get website working on k8s locally
  - Ingress
- Fix scrapper to upsert new data
- Get scrapper working on k8s
- Schedule scrapper with kron
- MongoDB data backup
- Publish site on Google Cloud

## Components

- GKE for managed K8s
- Python scrapper
- MongoDB for storing JSON listings
- NodeJS for API and serving index.html
- Github for VC
- Helm for managing applications in K8s
- ? for docker image storage
- Drone (runs inside Kubernetes) for CI


## Scripts

```bash
# setup google cloud sdk
wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-235.0.0-linux-x86_64.tar.gz
wget https://storage.googleapis.com/kubernetes-helm/helm-v2.12.3-linux-amd64.tar.gz

tar -xzvf google-cloud-sdk-235.0.0-linux-x86_64.tar.gz
tar -xzvf helm-v2.12.3-linux-amd64.tar.gz

export PATH=$PATH:~/google-cloud-sdk/bin:~/linux-amd64

# initialize the google cloud sdk
gcloud config set project apartments-139902
gcloud config set compute/zone us-west1-a
gcloud components update
gcloud components install kubectl

# initialize helm
helm init

# create k8s cluster
export CLUSTER_NAME=apartments

gcloud container clusters create $CLUSTER_NAME \
--num-nodes=3 \
--machine-type g1-small \
--preemptible \
--disk-size 10GB \
--enable-autoupgrade \
--enable-autorepair \
--no-enable-cloud-logging \
--no-enable-cloud-monitoring \
--no-issue-client-certificate \
--username daniel \
--password 1a2854Ufd3fg462B34

gcloud container clusters list

gcloud container clusters describe $CLUSTER_NAME

gcloud container clusters resize $CLUSTER_NAME --size=0

gcloud container clusters delete $CLUSTER_NAME
```


```bash
gcloud container clusters get-credentials $CLUSTER_NAME

kubectl create deployment apartments-api --image=gcr.io/hello-minikube-zero-install/hello-node

kubectl get deployments
kubectl get pods

kubectl expose deployment apartments-api --type=LoadBalancer --port=8080
kubectl get services



helm install --name nginx-ingress --namespace kube-system stable/nginx-ingress 
helm install --name db stable/mongodb
```

## Links

https://itsilesia.com/kubernetes-for-poor/

https://serverfault.com/questions/863569/kubernetes-can-i-avoid-using-the-gce-load-balancer-to-reduce-cost/869453#869453?newreg=8d728d4f3e474336b69e84c2a3994f5d