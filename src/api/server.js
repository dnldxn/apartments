'use strict';

const express = require('express')
const MongoClient = require('mongodb').MongoClient;


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
app.use(express.static('public'));


// MongoDB
const url = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
var db;


// Initialize DB Connection
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    if(err) throw err;

    db = client.db(DB_DATABASE);

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
    db.collection('listings').countDocuments({}, (err, result) => {
        if (err) throw err;
        res.send(`count: ${result}`);
    });
});

app.get('/listings', (req, res) => {
    db.collection('listings').find().toArray( (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
