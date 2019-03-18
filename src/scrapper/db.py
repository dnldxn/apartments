import os
from pymongo import MongoClient, UpdateOne

DB_HOST = os.environ['DB_HOST']
DB_PORT = int(os.environ['DB_PORT'])
DB_DATABASE = os.environ['DB_DATABASE']
DB_USERNAME = os.environ['DB_USERNAME']
DB_PASSWORD = os.environ['DB_PASSWORD']

client = MongoClient(DB_HOST, DB_PORT, username=DB_USERNAME, password=DB_PASSWORD, authSource=DB_DATABASE)

def insert_results(apartment, dt, listings):
    
    collection = client[DB_DATABASE]['listings']

    db_operations = []
    for listing in listings:
        
        unit = listing['unit']
        terms = listing['terms']
        size = int(listing.get('size', -1))
        floor = int(listing.get('floor', -1))
        beds = int(listing.get('beds', -1))
        baths = float(listing.get('baths', -1.0))
        available_dt = str(listing.get('available_dt', '1900-01-01'))
        
        # attempt "upsert" where document does not exist
        # do not alter the document if this is an update
        a = UpdateOne(
            { 'apartment': apartment, 'unit': unit},
            { '$setOnInsert': { 'size': size, 'floor': floor, 'beds': beds, 'baths': baths, 'available_dt': available_dt, 'terms': [{ 'dt': dt, 'price': terms }] }},
            upsert = True
        )
        
        # $push the element where "dt" does not exist
        b = UpdateOne(
            { 'apartment': apartment, 'unit': unit, 'terms.dt': { '$ne': dt } },
            { '$push': { "terms": { 'dt': dt, 'price': terms } }}
        )
        
        # $set the element where "dt" does exist
        c = UpdateOne(
            { 'apartment': apartment, 'unit': unit, 'terms.dt': dt },
            { '$set': { "terms.$": { 'dt': dt, 'price': terms } }}
        )
        
        # collect all the intended operations to be executed in bulk
        db_operations.extend([a, b, c])


    result = collection.bulk_write(db_operations)
    print(result.bulk_api_result)
