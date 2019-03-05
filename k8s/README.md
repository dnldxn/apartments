# k8s

## Create Cluster

Since we are trying to keep costs low, we want to avoid GKE creating a load balancer for us ($18 per month).  To work around this, we create two node pools.  One full of preemptible nodes that can be scaled to zero when not in use.  The other a single persistant node that can be assigned a static IP address.  The single node can be very small, since it will only be assigned to run the Nginix Ingress controller (reverse proxy).  The node label tells the Ingress controller to only run on the persistant node.

```bash
# Create the main node pool.  This can be scaled to 0 nodes when not in use.
gcloud container clusters create $CLUSTER_NAME \
--num-nodes=2 \
--machine-type g1-small \
--preemptible \
--disk-size 10GB \
--enable-autoupgrade \
--enable-autorepair \
--no-enable-cloud-logging \
--no-enable-cloud-monitoring \
--no-issue-client-certificate

# Create a pool that contains a single node.  This node will be always running so the IP address can remain static.  This node will run the k8s Ingress to the preemptible cluster above.
# Add a taint to the ingress node.  This means no pod can be scheduled onto this node unless it has the matching key "NoSchedule"
gcloud container node-pools create ingress-node-pool \
--cluster=$CLUSTER_NAME \
--num-nodes=1 \
--machine-type=f1-micro \
--disk-size 10GB \
--node-labels=ingress=true \
--enable-autoupgrade \
--enable-autorepair \
--node-taints=ingress=true:NoExecute \
--node-labels=ingress=true

# Firewall rules to allow port 80 and 443
gcloud compute firewall-rules create ingress-firewall-rule --allow tcp:80,tcp:443 --source-ranges=0.0.0.0/0

# Create Secret (make sure env variables are created first!)
kubectl create secret generic db-secret \
--from-literal=mongodb-root-password=$DB_ROOT_PASSWORD \
--from-literal=mongodb-username=$DB_USERNAME \
--from-literal=mongodb-password=$DB_PASSWORD \
--from-literal=mongodb-database=$DB_DATABASE \
--from-literal=mongodb-replica-set-key=$DB_REPLICA_SET_KEY

# setup kubectl to connect to the cluster
gcloud container clusters get-credentials $CLUSTER_NAME

# Setup Helm's Tiller service account on the cluster
kubectl create serviceaccount --namespace kube-system tiller
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
helm init --service-account tiller --upgrade

# Test Tiller works
helm list
helm repo update
```

## Database

```bash
# make sure the credentials have been created first
helm install --name db -f db.yml stable/mongodb

# scaling not tested
kubectl scale statefulset my-release-mongodb-secondary --replicas=3

helm delete --purge db
```

## API

```bash
kubectl apply -f api.yml
```

## Ingress

```bash
kubectl apply -f ingress.yml

helm install --name nginx-ingress -f ingress-controller.yml stable/nginx-ingress

helm delete --purge nginx-ingress
```
