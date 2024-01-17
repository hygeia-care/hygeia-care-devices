const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    measurement: {
        type: String,
        required: true
    }
});

analysisSchema.methods.cleanup = function() {
    return {
        id: this._id,
        value: this.value,
        measurement: this.measurement
    }
}

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;