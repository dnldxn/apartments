#

```bash
# Resize the number of nodes in the main node pool
gcloud container clusters resize $CLUSTER_NAME --node-pool default-pool --size=0

# Stop the cluster
gcloud container clusters delete $CLUSTER_NAME
```
