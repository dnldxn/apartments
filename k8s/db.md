# DB

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

# Copy collection
```bash
db.fromCollection.aggregate([ { $match: {} }, { $out: "toCollection" } ])

db.test.find({}).forEach(function(listing) {
    terms = []
    for(i = 0; i != listing.terms.length; ++i) {
        price = []
        for(key in listing.terms[i]) {
            if(key !== "scrape_dt") price.push( { "k": key.split("_")[1], "v": listing.terms[i][key] } )
        }
        terms.push({
            "dt": listing.terms[i]["scrape_dt"],
            "price": price
        });
    }

    listing['terms'] = terms;
    db.test.save(listing);
})
```

## Backup

https://medium.com/@epatro/how-to-back-up-a-mongodb-database-deployed-to-a-kubernetes-environment-ed681f4f7146
