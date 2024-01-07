const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: false
    },
    comment: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
});

measurementSchema.methods.cleanup = function() {
    return {
        id: this._id,
        title: this.title,
        date: this.date,
        comment: this.comment,
        type: this.type,
        user: this.user
    }
}

const Measurement = mongoose.model('Measurement', measurementSchema);

module.exports = Measurement;