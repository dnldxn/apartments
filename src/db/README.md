# DB


## Install

```bash
helm install --name db -f values.yml stable/mongodb

# scaling not tested
kubectl scale statefulset my-release-mongodb-secondary --replicas=3

helm delete --purge db
```

## Connect through command line

```bash
# start a Mongo client container on the cluster and connect to it
kubectl run db-mongodb-client --rm --tty -i --restart='Never' --image bitnami/mongodb --command /bin/bash

# from the container we can connect to the database
mongo apartmentDB --host db-mongodb -u apartmentUser -p
mongo admin --host db-mongodb --authenticationDatabase admin -u root -p

use apartments
show users
db.test.insertOne( { x: 1 } );
db.listings.count();
db.listings.remove({});
quit()
```

## Backup

https://medium.com/@epatro/how-to-back-up-a-mongodb-database-deployed-to-a-kubernetes-environment-ed681f4f7146
