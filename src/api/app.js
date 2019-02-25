const express = require('express')
// const mongoose = require('mongoose');

const app = express();
app.use(express.static('public'));
const port = process.env.PORT || 5000;

// mongoose.connect('mongodb://localhost:27017/apartments', {user: 'apartments', pass: 'apartments', auth: {authdb: 'admin'}});
// mongoose.set('debug', true); // turn on debug

// const unitModel = new mongoose.Schema({
//     apartment: { type: String },
//     floorplan: { type: String },
//     unit: { type: String },
// });
// const Unit = mongoose.model('units', unitModel);

app.get('/ping', (req, res) => {
    res.send('pong');
});

// app.get('/units', (req, res) => {
//     Unit.find({}, (err, units) => {
//         res.json(units);
//     })  
// });

// routes go here
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
