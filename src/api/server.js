'use strict';

const express = require('express')
// const mongoose = require('mongoose');

// Constants
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// MongoDB
// mongoose.connect('mongodb://localhost:27017/apartments', {user: 'apartments', pass: 'apartments', auth: {authdb: 'admin'}});
// mongoose.set('debug', true); // turn on debug

// const unitModel = new mongoose.Schema({
//     apartment: { type: String },
//     floorplan: { type: String },
//     unit: { type: String },
// });
// const Unit = mongoose.model('units', unitModel);

// App
const app = express();
app.use(express.static('public'));

app.get('/ping', (req, res) => {
    res.send('pong');
});

// app.get('/units', (req, res) => {
//     Unit.find({}, (err, units) => {
//         res.json(units);
//     })  
// });

// routes go here
app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});
