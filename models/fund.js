var mongoose = require('mongoose');
var FundSchema = mongoose.Schema({
    _id: { type: String }
    ,
    date: {
        type: Date
    },
    dateJalali: {
        type: String
    },
    price: {
        type: Number
    },
    personId: {
        type: String
    },
    projectId: {
        type: String
    },
    description: {
        type: String
    }
}, {
        collection: 'Funds',
        strict: true
    });

module.exports = mongoose.model('Fund', FundSchema);
