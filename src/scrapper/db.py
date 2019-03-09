import os
from pymongo import MongoClient, UpdateOne

DB_HOST = os.environ['DB_HOST']
DB_PORT = int(os.environ['DB_PORT'])
DB_DATABASE = os.environ['DB_DATABASE']
DB_USERNAME = os.environ['DB_USERNAME']
DB_PASSWORD = os.environ['DB_PASSWORD']

client = MongoClient(DB_HOST, DB_PORT, username=DB_USERNAME, password=DB_PASSWORD, authSource=DB_DATABASE)

def insert_results(apartment, dt, listings):
    
    collection = client[DB_DATABASE]['test']

    db_operations = []
    for listing in listings:
        
        # apartment = r['apartment']
        unit = listing['unit']
        terms = listing['terms']
        size = listing['size']
        floor = listing['floor']
        
        # attempt "upsert" where document does not exist
        # do not alter the document if this is an update
        a = UpdateOne(
            { 'apartment': apartment, 'unit': unit},
            { '$setOnInsert': { 'size': size, 'floor': floor, 'terms': [{ 'dt': dt, 'price': terms }] }},
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
