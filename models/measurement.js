const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    title: String,
    date: Date,
    comment: String,
    type: String,
    user: String
});

const Measurement = mongoose.model('Measurement', measurementSchema);

module.exports = Measurement;