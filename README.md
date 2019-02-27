# Apartments

## TODO

- Fix scrapper to upsert new data
- Get scrapper working on k8s
- Schedule scrapper with kron
- MongoDB data backup

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

### Setup Google Cloud SDK and Helm on Cloud9

```bash
cd ~
wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-236.0.0-linux-x86_64.tar.gz
tar -xzvf google-cloud-sdk-236.0.0-linux-x86_64.tar.gz

wget https://storage.googleapis.com/kubernetes-helm/helm-v2.12.3-linux-amd64.tar.gz
tar -xzvf helm-v2.12.3-linux-amd64.tar.gz

export PATH=$PATH:~/google-cloud-sdk/bin:~/linux-amd64

gcloud config set project apartments-139902
gcloud config set compute/zone us-west1-a
gcloud components update
gcloud components install kubectl
gcloud auth login
```

### Create k8s cluster

```bash
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


gcloud container clusters resize $CLUSTER_NAME --size=0

gcloud container clusters delete $CLUSTER_NAME
```

### Setup Helm and a K8S Ingress on the cluster

```bash
# setup kubectl to connect to the cluster
gcloud container clusters get-credentials $CLUSTER_NAME

# setup Helm's Tiller service account on the cluster
kubectl create serviceaccount --namespace kube-system tiller
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
# kubectl patch deploy --namespace kube-system tiller-deploy -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'
helm init --service-account tiller --upgrade

# test Tiller works
helm list
helm repo update

# install nginx-ingress controller
helm install --name nginx-ingress stable/nginx-ingress
helm install --name nginx-ingress stable/nginx-ingress --set rbac.create=true
helm delete nginx-ingress
```
