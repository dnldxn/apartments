import os
from pymongo import MongoClient, UpdateOne

DB_HOST = os.environ['DB_HOST']
DB_PORT = int(os.environ['DB_PORT'])
DB_DATABASE = os.environ['DB_DATABASE']
DB_USERNAME = os.environ['DB_USERNAME']
DB_PASSWORD = os.environ['DB_PASSWORD']

client = MongoClient(DB_HOST, DB_PORT, username=DB_USERNAME, password=DB_PASSWORD, authSource=DB_DATABASE)

# def insert_results(results):
    
#     collection = client[DB_DATABASE]['listings']
    
#     db_result = collection.insert_many(results)
#     print('Inserted {} records'.format(len(db_result.inserted_ids)))


def insert_results(apartment, scrape_dt, listings):
    
    collection = client[DB_DATABASE]['listings']

    db_operations = []
    for listing in listings:
        
        # apartment = r['apartment']
        unit = listing['unit']
        terms = listing['terms']
        
        # attempt "upsert" where document does not exist
        # do not alter the document if this is an update
        a = UpdateOne(
            { 'apartment': apartment, 'unit': unit },
            { '$setOnInsert': { 'terms': [{ 'scrape_dt': scrape_dt, **terms }] }},
            upsert = True
        )
        
        # $push the element where "scrape_dt" does not exist
        b = UpdateOne(
            { 'apartment': apartment, 'unit': unit, 'terms.scrape_dt': { '$ne': scrape_dt } },
            { '$push': { "terms": { 'scrape_dt': scrape_dt, **terms } }}
        )
        
        # $set the element where "scrape_dt" does exist
        c = UpdateOne(
            { 'apartment': apartment, 'unit': unit, 'terms.scrape_dt': scrape_dt },
            { '$set': { "terms.$": { 'scrape_dt': scrape_dt, **terms } }}
        )
        
        # collect all the intended operations to be executed in bulk
        db_operations.extend([a, b, c])


    result = collection.bulk_write(db_operations)
    print(result.bulk_api_result)
