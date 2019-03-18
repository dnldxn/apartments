# Cloud9 Environment Setup

```bash
cd ~
wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-238.0.0-linux-x86_64.tar.gz
tar -xzvf google-cloud-sdk-238.0.0-linux-x86_64.tar.gz

wget https://storage.googleapis.com/kubernetes-helm/helm-v2.13.0-linux-amd64.tar.gz
tar -xzvf helm-v2.13.0-linux-amd64.tar.gz

# Add to .bashrc
export PATH=$PATH:~/google-cloud-sdk/bin:~/linux-amd64
export CLUSTER_NAME=apartments

# Setup gcloud CLI
gcloud config set project apartments-139902
gcloud config set compute/zone us-west1-a
gcloud config set container/cluster $CLUSTER_NAME
gcloud components update
gcloud components install kubectl
gcloud auth login

# Update Python version (required for scrapper)
sudo apt-get install python3.6 python3.6-venv -y
sudo python3.6 -m ensurepip --upgrade
sudo pip3.6 install --upgrade pip

# Install Python packages
pip3.6 install -r src/scrapper/requirements.txt

# Update Node version
nvm i v11
nvm alias default 11

# Install Node Packages
npm install -g nodemon
npm install -g parcel-bundler
```
