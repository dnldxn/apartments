# Cloud9 Environment Setup

```bash
cd ~
wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-236.0.0-linux-x86_64.tar.gz
tar -xzvf google-cloud-sdk-236.0.0-linux-x86_64.tar.gz

wget https://storage.googleapis.com/kubernetes-helm/helm-v2.12.3-linux-amd64.tar.gz
tar -xzvf helm-v2.12.3-linux-amd64.tar.gz

# Add to .bashrc or .profile
export PATH=$PATH:~/google-cloud-sdk/bin:~/linux-amd64
export CLUSTER_NAME=apartments

# Setup gcloud CLI
gcloud config set project apartments-139902
gcloud config set compute/zone us-west1-a
gcloud config set container/cluster $CLUSTER_NAME
gcloud components update
gcloud components install kubectl
gcloud auth login
```
