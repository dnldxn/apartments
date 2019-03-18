'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;


// Constants
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;


// Express
const app = express();
app.use(bodyParser.json());
app.use(express.static('./dist'));


// MongoDB
const url = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
let db;
let dbc;


// Initialize DB Connection
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  if(err) throw err;

  db = client.db(DB_DATABASE);
  dbc = db.collection('listings');

  // Start the application after the database connection is ready
  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
});


// Express Routes

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/listings_count', (req, res) => {
  dbc.countDocuments({}, (err, result) => {
    if (err) throw err;
    res.send(`count: ${result}`);
  });
});

app.get('/listings', (req, res) => {
  dbc.aggregate([
    { $sort: { "terms.scrape_date": -1 } },
    { $addFields: { minPrice: { $arrayElemAt: [ "$terms", -1 ] } } },
    { $addFields: { minPrice: { $min: "$minPrice.price.v" } } },
  ]).sort({ sort: -1, apartment: 1, unit: 1 })
    .toArray( (err, result) => {
      if (err) throw err;
      res.send(result);
  });
});

app.get('/listings/:listingId', (req, res) => {
  const listingId = new ObjectID(req.params.listingId);

  dbc.findOne({ '_id': listingId }, (err, result) => {
      if (err) throw err;
      res.send(result);
  });
});

app.post('/listings/:listingId/hide', (req, res) => {
  const listingId = new ObjectID(req.params.listingId);
  const display = req.body['display'];

  dbc.updateOne(
    { '_id': listingId }, 
    { $set: { "display" : display } }, 
    (err, result) => {
      if (err) throw err;
      res.send("success");
  });
});

app.post('/listings/sort', (req, res) => {
  
  const sorts = req.body;

  let bulk = dbc.initializeUnorderedBulkOp();
  for(var id in sorts) {
    const query = { _id: new ObjectID(id) };
    const update = { $set: { sort: sorts[id] } };
    
    bulk.find(query).updateOne(update);
  }
  
  bulk.execute(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});
